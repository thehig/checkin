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
      topics: 'id, name, createdAt',
      events: 'id, topicId, timestamp, createdAt',
      reminders: 'id, name, isActive, triggerEventTopicId, nextScheduled',
      reminderInstances: 'id, reminderId, scheduledTime, status',
      users: 'id, email, supabaseId',
      settings: 'id, userId',
    }).upgrade(async tx => {
      // Migration: Clear old data and reinitialize
      // This is safe for development - in production you'd want more sophisticated migration
      await tx.table('axes').clear();
      await tx.table('topics').clear();
      await tx.table('events').clear();
    });
  }
}

export const db = new WellnessDatabase();

// Initialize default data
export async function initializeDefaultData() {
  const axesCount = await db.axes.count();
  
  if (axesCount === 0) {
    // Create default topics first
    const defaultTopics: Topic[] = [
      {
        id: 'topic-wellness',
        name: 'Wellness Check',
        description: 'Track your mental, physical, and emotional wellbeing',
        icon: '✨',
        color: '#A78BFA',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'topic-wakeup',
        name: 'Wake Up',
        description: 'Start of the day',
        icon: '🌅',
        color: '#FCD34D',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'topic-medication',
        name: 'Take Medication',
        description: 'ADHD medication',
        icon: '💊',
        color: '#60A5FA',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    
    await db.topics.bulkAdd(defaultTopics);
    
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
    
    await db.axes.bulkAdd(wellnessAxes);
  }
}
