import Dexie, { Table } from 'dexie';
import type { 
  Axis, 
  Topic, 
  TopicAxis, 
  Event, 
  EventValue, 
  Reminder,
  ScheduledReminder 
} from './types';

export class WellnessDatabase extends Dexie {
  axes!: Table<Axis, string>;
  topics!: Table<Topic, string>;
  topicAxes!: Table<TopicAxis, string>;
  events!: Table<Event, string>;
  eventValues!: Table<EventValue, string>;
  reminders!: Table<Reminder, string>;
  scheduledReminders!: Table<ScheduledReminder, string>;
  syncQueue!: Table<SyncQueueItem, number>;

  constructor() {
    super('WellnessTracker');
    
    this.version(1).stores({
      axes: 'id, user_id, name, is_default',
      topics: 'id, user_id, name, is_wellness_check',
      topicAxes: 'id, topic_id, axis_id',
      events: 'id, user_id, topic_id, occurred_at',
      eventValues: 'id, event_id, axis_id',
      reminders: 'id, user_id, trigger_topic_id, target_topic_id, is_active',
      scheduledReminders: 'id, reminder_id, user_id, scheduled_for, status',
      syncQueue: '++id, table, operation, timestamp',
    });
  }
}

export interface SyncQueueItem {
  id?: number;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  record_id: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

export const db = new WellnessDatabase();

// Sync helper functions
export const queueSync = async (
  table: string,
  operation: 'insert' | 'update' | 'delete',
  record_id: string,
  data?: Record<string, unknown>
) => {
  await db.syncQueue.add({
    table,
    operation,
    record_id,
    data,
    timestamp: Date.now(),
  });
};

// Process sync queue (call this when online)
export const processSyncQueue = async (supabaseClient: unknown) => {
  const items = await db.syncQueue.toArray();
  
  for (const item of items) {
    try {
      // Process sync based on operation
      // This is a simplified version - you'll need to implement actual sync logic
      await db.syncQueue.delete(item.id!);
    } catch (error) {
      console.error('Sync failed for item:', item, error);
    }
  }
};
