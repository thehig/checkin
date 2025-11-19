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
    
    this.version(1).stores({
      axes: 'id, name, createdAt',
      topics: 'id, name, createdAt',
      events: 'id, topicId, timestamp, createdAt',
      reminders: 'id, name, isActive, triggerEventTopicId, nextScheduled',
      reminderInstances: 'id, reminderId, scheduledTime, status',
      users: 'id, email, supabaseId',
      settings: 'id, userId',
    });
  }
}

export const db = new WellnessDatabase();

// Initialize default data
export async function initializeDefaultData() {
  const axesCount = await db.axes.count();
  
  if (axesCount === 0) {
    // Create default wellness axes
    const defaultAxes: Axis[] = [
      {
        id: 'axis-mental',
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
        name: 'Emotional',
        description: 'Emotional state and mood',
        icon: '❤️',
        minLabel: 'Worst',
        maxLabel: 'Best',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    
    await db.axes.bulkAdd(defaultAxes);
    
    // Create default topics
    const defaultTopics: Topic[] = [
      {
        id: 'topic-wakeup',
        name: 'Wake Up',
        description: 'Start of the day',
        icon: '🌅',
        axisIds: [],
        includeWellnessCheck: true,
        color: '#FCD34D',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'topic-medication',
        name: 'Take Medication',
        description: 'ADHD medication',
        icon: '💊',
        axisIds: [],
        includeWellnessCheck: false,
        color: '#60A5FA',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'topic-wellness',
        name: 'Wellness Check',
        description: 'Check in with yourself',
        icon: '✨',
        axisIds: ['axis-mental', 'axis-physical', 'axis-emotional'],
        includeWellnessCheck: true,
        color: '#A78BFA',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];
    
    await db.topics.bulkAdd(defaultTopics);
  }
}
