import { createContext, useContext, useEffect, useState } from 'react';
import { db, initializeDefaultData } from '../database';
import { syncToCloud, syncFromCloud, deleteFromCloud } from '../supabase';
import { useNotification } from './NotificationContext';
import type { Axis, Topic, Event, Reminder, ReminderInstance } from '../types';

type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface DataContextType {
  axes: Axis[];
  topics: Topic[];
  events: Event[];
  reminders: Reminder[];
  reminderInstances: ReminderInstance[];
  
  // Sync status
  syncStatus: SyncStatus;
  lastSyncTime: number | undefined;
  
  // Helper methods
  getAxesByTopic: (topicId: string) => Axis[];
  
  // Sync operations
  syncNow: (userId: string) => Promise<void>;
  enableAutoSync: (userId: string) => void;
  disableAutoSync: () => void;
  
  // Axes operations
  addAxis: (axis: Omit<Axis, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAxis: (id: string, updates: Partial<Axis>) => Promise<void>;
  deleteAxis: (id: string) => Promise<void>;
  
  // Topics operations
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'displayOrder'>) => Promise<string>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  reorderTopics: (reorderedTopics: Topic[]) => Promise<void>;
  
  // Events operations
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  // Reminders operations
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  
  // Reminder instances operations
  addReminderInstance: (instance: Omit<ReminderInstance, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateReminderInstance: (id: string, updates: Partial<ReminderInstance>) => Promise<void>;
  
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [axes, setAxes] = useState<Axis[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderInstances, setReminderInstances] = useState<ReminderInstance[]>([]);
  
  // Sync state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [lastSyncTime, setLastSyncTime] = useState<number | undefined>();
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [syncQueue, setSyncQueue] = useState<Set<string>>(new Set());
  
  const { showSuccess, showError } = useNotification();

  const refresh = async () => {
    const [axesData, topicsData, eventsData, remindersData, instancesData] = await Promise.all([
      db.axes.toArray(),
      db.topics.orderBy('displayOrder').toArray(),
      db.events.orderBy('timestamp').reverse().toArray(),
      db.reminders.toArray(),
      db.reminderInstances.orderBy('scheduledTime').toArray(),
    ]);
    
    setAxes(axesData);
    setTopics(topicsData);
    setEvents(eventsData);
    setReminders(remindersData);
    setReminderInstances(instancesData);
  };

  useEffect(() => {
    initializeDefaultData().then(refresh);
  }, []);

  // Helper methods
  const getAxesByTopic = (topicId: string) => {
    return axes.filter(axis => axis.topicId === topicId);
  };

  // Sync methods
  const syncNow = async (userId: string) => {
    if (!userId) return;
    
    setSyncStatus('syncing');
    try {
      // Sync each table
      const tables = ['axes', 'topics', 'events', 'reminders', 'reminder_instances'];
      const dbTables = [db.axes, db.topics, db.events, db.reminders, db.reminderInstances];
      
      for (let i = 0; i < tables.length; i++) {
        const tableName = tables[i];
        const dbTable = dbTables[i];
        
        // Push local changes to cloud
        const localData = await dbTable.toArray();
        if (localData.length > 0) {
          const { error } = await syncToCloud(tableName, localData, userId);
          if (error) {
            console.error(`Error syncing ${tableName} to cloud:`, error);
            throw error;
          }
        }
        
        // Pull cloud changes and merge
        const { data: cloudData, error } = await syncFromCloud(tableName, userId);
        if (error) {
          console.error(`Error syncing ${tableName} from cloud:`, error);
          throw error;
        }
        
        if (cloudData && cloudData.length > 0) {
          // Merge strategy: last write wins based on updatedAt
          for (const cloudItem of cloudData) {
            const localItem = await dbTable.get(cloudItem.id);
            if (!localItem || cloudItem.updatedAt > localItem.updatedAt) {
              // Cloud version is newer or doesn't exist locally
              // Data is already in camelCase from syncFromCloud
              await dbTable.put(cloudItem);
            }
          }
        }
      }
      
      await refresh();
      setLastSyncTime(Date.now());
      setSyncStatus('synced');
      showSuccess('Data synced successfully');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      showError(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const enableAutoSync = (userId: string) => {
    setCurrentUserId(userId);
    setAutoSyncEnabled(true);
  };

  const disableAutoSync = () => {
    setAutoSyncEnabled(false);
    setCurrentUserId(null);
    setSyncStatus('offline');
  };

  // Auto-sync effect
  useEffect(() => {
    if (autoSyncEnabled && currentUserId) {
      // Initial sync
      syncNow(currentUserId);
      
      // Periodic sync every 5 minutes
      const interval = setInterval(() => {
        syncNow(currentUserId);
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoSyncEnabled, currentUserId]);

  // Trigger sync when data changes (debounced)
  useEffect(() => {
    if (autoSyncEnabled && currentUserId && syncQueue.size > 0) {
      const timeout = setTimeout(() => {
        syncNow(currentUserId);
        setSyncQueue(new Set());
      }, 2000); // 2 second debounce
      
      return () => clearTimeout(timeout);
    }
  }, [syncQueue, autoSyncEnabled, currentUserId]);

  // Axes operations
  const addAxis = async (axis: Omit<Axis, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `axis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    await db.axes.add({ ...axis, id, createdAt: now, updatedAt: now });
    await refresh();
    if (autoSyncEnabled) setSyncQueue(prev => new Set(prev).add('axes'));
    return id;
  };

  const updateAxis = async (id: string, updates: Partial<Axis>) => {
    await db.axes.update(id, { ...updates, updatedAt: Date.now() });
    await refresh();
    if (autoSyncEnabled) setSyncQueue(prev => new Set(prev).add('axes'));
  };

  const deleteAxis = async (id: string) => {
    await db.axes.delete(id);
    if (autoSyncEnabled && currentUserId) {
      await deleteFromCloud('axes', id, currentUserId);
    }
    await refresh();
  };

  // Topics operations
  const addTopic = async (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt' | 'displayOrder'>) => {
    const id = `topic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    // Set displayOrder to be the highest + 1
    const maxOrder = topics.length > 0 ? Math.max(...topics.map(t => t.displayOrder)) : -1;
    await db.topics.add({ ...topic, id, displayOrder: maxOrder + 1, createdAt: now, updatedAt: now });
    await refresh();
    if (autoSyncEnabled) setSyncQueue(prev => new Set(prev).add('topics'));
    return id;
  };

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    await db.topics.update(id, { ...updates, updatedAt: Date.now() });
    await refresh();
    if (autoSyncEnabled) setSyncQueue(prev => new Set(prev).add('topics'));
  };

  const deleteTopic = async (id: string) => {
    await db.topics.delete(id);
    if (autoSyncEnabled && currentUserId) {
      await deleteFromCloud('topics', id, currentUserId);
    }
    await refresh();
  };

  const reorderTopics = async (reorderedTopics: Topic[]) => {
    const now = Date.now();
    // Update displayOrder for each topic
    for (let i = 0; i < reorderedTopics.length; i++) {
      await db.topics.update(reorderedTopics[i].id, {
        displayOrder: i,
        updatedAt: now,
      });
    }
    await refresh();
    if (autoSyncEnabled) setSyncQueue(prev => new Set(prev).add('topics'));
  };

  // Events operations
  const addEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const newEvent = { ...event, id, createdAt: now, updatedAt: now };
    await db.events.add(newEvent);
    await refresh();
    if (autoSyncEnabled) setSyncQueue(prev => new Set(prev).add('events'));
    
    // Check for reminders that should be triggered
    await checkAndScheduleReminders(newEvent);
    
    return id;
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    await db.events.update(id, { ...updates, updatedAt: Date.now() });
    await refresh();
    if (autoSyncEnabled) setSyncQueue(prev => new Set(prev).add('events'));
  };

  const deleteEvent = async (id: string) => {
    await db.events.delete(id);
    if (autoSyncEnabled && currentUserId) {
      await deleteFromCloud('events', id, currentUserId);
    }
    await refresh();
  };

  // Reminders operations
  const addReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    await db.reminders.add({ ...reminder, id, createdAt: now, updatedAt: now });
    await refresh();
    return id;
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    await db.reminders.update(id, { ...updates, updatedAt: Date.now() });
    await refresh();
  };

  const deleteReminder = async (id: string) => {
    await db.reminders.delete(id);
    await refresh();
  };

  // Reminder instances operations
  const addReminderInstance = async (instance: Omit<ReminderInstance, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    await db.reminderInstances.add({ ...instance, id, createdAt: now, updatedAt: now });
    await refresh();
    return id;
  };

  const updateReminderInstance = async (id: string, updates: Partial<ReminderInstance>) => {
    await db.reminderInstances.update(id, { ...updates, updatedAt: Date.now() });
    await refresh();
  };

  // Helper function to check and schedule reminders
  const checkAndScheduleReminders = async (event: Event) => {
    const activeReminders = await db.reminders
      .where('isActive')
      .equals(1)
      .toArray();
    
    for (const reminder of activeReminders) {
      if (reminder.triggerType === 'after-event' && 
          reminder.triggerEventTopicId === event.topicId) {
        
        const offsetMs = (reminder.triggerOffsetMinutes || 0) * 60 * 1000;
        const scheduledTime = event.timestamp + offsetMs;
        
        // Check if there's a latest time constraint
        if (reminder.triggerLatestTime) {
          const [hours, minutes] = reminder.triggerLatestTime.split(':').map(Number);
          const latestTime = new Date(scheduledTime);
          latestTime.setHours(hours, minutes, 0, 0);
          
          if (scheduledTime > latestTime.getTime()) {
            // Schedule for the latest time instead
            await addReminderInstance({
              reminderId: reminder.id,
              scheduledTime: latestTime.getTime(),
              status: 'pending',
            });
            continue;
          }
        }
        
        await addReminderInstance({
          reminderId: reminder.id,
          scheduledTime,
          status: 'pending',
        });
      }
    }
  };

  const value: DataContextType = {
    axes,
    topics,
    events,
    reminders,
    reminderInstances,
    syncStatus,
    lastSyncTime,
    getAxesByTopic,
    syncNow,
    enableAutoSync,
    disableAutoSync,
    addAxis,
    updateAxis,
    deleteAxis,
    addTopic,
    updateTopic,
    deleteTopic,
    reorderTopics,
    addEvent,
    updateEvent,
    deleteEvent,
    addReminder,
    updateReminder,
    deleteReminder,
    addReminderInstance,
    updateReminderInstance,
    refresh,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
