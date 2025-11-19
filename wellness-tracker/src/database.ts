import Dexie, { type Table } from 'dexie';
import type {
  Axis,
  Topic,
  Event,
  Reminder,
  ReminderInstance,
  User,
  AppSettings,
} from './types';

export class WellnessDatabase extends Dexie {
  axes!: Table<Axis, string>;
  topics!: Table<Topic, string>;
  events!: Table<Event, string>;
  reminders!: Table<Reminder, string>;
  reminderInstances!: Table<ReminderInstance, string>;
  users!: Table<User, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('WellnessTrackerDB');
    
    // Version 1: Original schema
    this.version(1).stores({
      axes: 'id, name, createdAt',
      topics: 'id, name, createdAt',
      events: 'id, topicId, timestamp, createdAt',
      reminders: 'id, name, isActive, triggerEventTopicId, nextScheduled',
      reminderInstances: 'id, reminderId, scheduledTime, status',
      users: 'id, email, supabaseId',
      settings: 'id, userId',
    });
    
    // Version 2: Updated schema with axes belonging to topics
    this.version(2).stores({
      axes: 'id, topicId, name, createdAt',
      topics: 'id, name, displayOrder, createdAt',
      events: 'id, topicId, timestamp, createdAt',
      reminders: 'id, name, isActive, triggerEventTopicId, nextScheduled',
      reminderInstances: 'id, reminderId, scheduledTime, status',
      users: 'id, email, supabaseId',
      settings: 'id, userId',
    }).upgrade(async tx => {
      // Migration: Add displayOrder to existing topics
      const topics = await tx.table('topics').toArray();
      for (let i = 0; i < topics.length; i++) {
        await tx.table('topics').update(topics[i].id, {
          displayOrder: topics[i].displayOrder !== undefined ? topics[i].displayOrder : i
        });
      }
      
      // Update axes to have topicId if needed
      const axes = await tx.table('axes').toArray();
      for (const axis of axes) {
        if (!axis.topicId) {
          // Assign orphaned axes to wellness topic or delete them
          await tx.table('axes').delete(axis.id);
        }
      }
    });
  }
}

export const db = new WellnessDatabase();

// Initialize default data
export async function initializeDefaultData() {
  const topicsCount = await db.topics.count();
  
  if (topicsCount === 0) {
    // Create default topics first
    const defaultTopics: Topic[] = [
      {
        id: 'topic-wellness',
        name: 'Wellness Check',
        description: 'Track your mental, physical, and emotional wellbeing',
        icon: '✨',
        color: '#A78BFA',
        displayOrder: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'topic-wakeup',
        name: 'Wake Up',
        description: 'Start of the day',
        icon: '🌅',
        color: '#FCD34D',
        displayOrder: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'topic-medication',
        name: 'Take Medication',
        description: 'ADHD medication',
        icon: '💊',
        color: '#60A5FA',
        displayOrder: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    
    // Use put instead of bulkAdd to handle duplicates
    for (const topic of defaultTopics) {
      await db.topics.put(topic);
    }
    
    // Create default wellness axes (belonging to Wellness topic)
    const wellnessAxes: Axis[] = [
      {
        id: 'axis-mental',
        topicId: 'topic-wellness',
        name: 'Mental',
        description: 'Mental clarity and focus',
        icon: '🧠',
        minLabel: 'Worst',
        maxLabel: 'Best',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'axis-physical',
        topicId: 'topic-wellness',
        name: 'Physical',
        description: 'Physical energy and wellbeing',
        icon: '💪',
        minLabel: 'Worst',
        maxLabel: 'Best',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'axis-emotional',
        topicId: 'topic-wellness',
        name: 'Emotional',
        description: 'Emotional state and mood',
        icon: '❤️',
        minLabel: 'Worst',
        maxLabel: 'Best',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    
    // Use put instead of bulkAdd to handle duplicates
    for (const axis of wellnessAxes) {
      await db.axes.put(axis);
    }
  }
}
