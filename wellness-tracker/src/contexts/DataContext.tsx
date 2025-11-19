import { createContext, useContext, useEffect, useState } from 'react';
import { db, initializeDefaultData } from '../database';
import type { Axis, Topic, Event, Reminder, ReminderInstance } from '../types';

interface DataContextType {
  axes: Axis[];
  topics: Topic[];
  events: Event[];
  reminders: Reminder[];
  reminderInstances: ReminderInstance[];
  
  // Helper methods
  getAxesByTopic: (topicId: string) => Axis[];
  
  // Axes operations
  addAxis: (axis: Omit<Axis, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAxis: (id: string, updates: Partial<Axis>) => Promise<void>;
  deleteAxis: (id: string) => Promise<void>;
  
  // Topics operations
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTopic: (id: string, updates: Partial<Topic>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  
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

  const refresh = async () => {
    const [axesData, topicsData, eventsData, remindersData, instancesData] = await Promise.all([
      db.axes.toArray(),
      db.topics.toArray(),
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

  // Axes operations
  const addAxis = async (axis: Omit<Axis, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `axis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    await db.axes.add({ ...axis, id, createdAt: now, updatedAt: now });
    await refresh();
    return id;
  };

  const updateAxis = async (id: string, updates: Partial<Axis>) => {
    await db.axes.update(id, { ...updates, updatedAt: Date.now() });
    await refresh();
  };

  const deleteAxis = async (id: string) => {
    await db.axes.delete(id);
    await refresh();
  };

  // Topics operations
  const addTopic = async (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `topic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    await db.topics.add({ ...topic, id, createdAt: now, updatedAt: now });
    await refresh();
    return id;
  };

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    await db.topics.update(id, { ...updates, updatedAt: Date.now() });
    await refresh();
  };

  const deleteTopic = async (id: string) => {
    await db.topics.delete(id);
    await refresh();
  };

  // Events operations
  const addEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const newEvent = { ...event, id, createdAt: now, updatedAt: now };
    await db.events.add(newEvent);
    await refresh();
    
    // Check for reminders that should be triggered
    await checkAndScheduleReminders(newEvent);
    
    return id;
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    await db.events.update(id, { ...updates, updatedAt: Date.now() });
    await refresh();
  };

  const deleteEvent = async (id: string) => {
    await db.events.delete(id);
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
    getAxesByTopic,
    addAxis,
    updateAxis,
    deleteAxis,
    addTopic,
    updateTopic,
    deleteTopic,
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
