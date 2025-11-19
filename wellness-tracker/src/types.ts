export interface Axis {
  id: string;
  topicId: string; // Axis belongs to exactly one Topic
  name: string;
  description?: string;
  icon?: string;
  minLabel?: string; // Label for 0/1 (e.g., "Bad", "Low")
  maxLabel?: string; // Label for 5 (e.g., "Good", "High")
  createdAt: number;
  updatedAt: number;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface EventAxis {
  axisId: string;
  value: number; // 0.0 - 5.0
}

export interface Event {
  id: string;
  topicId: string;
  timestamp: number;
  axes: EventAxis[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Reminder {
  id: string;
  name: string;
  description?: string;
  topicId?: string; // Optional: associated with a topic
  
  // Trigger configuration
  triggerType: 'time' | 'after-event' | 'before-event';
  triggerTime?: string; // For 'time' type (HH:MM format)
  triggerEventTopicId?: string; // For 'after-event' or 'before-event'
  triggerOffsetMinutes?: number; // Offset from event
  triggerLatestTime?: string; // "or by X time" (HH:MM format)
  
  // Repeat configuration
  repeatCount?: number; // How many times to repeat
  repeatIntervalMinutes?: number; // Interval between repeats
  
  // State
  isActive: boolean;
  lastTriggered?: number;
  nextScheduled?: number;
  
  // Child reminders (spawned by this reminder)
  spawnsReminders?: string[]; // Reminder IDs
  
  createdAt: number;
  updatedAt: number;
}

export interface ReminderInstance {
  id: string;
  reminderId: string;
  scheduledTime: number;
  status: 'pending' | 'snoozed' | 'dismissed' | 'completed';
  completedEventId?: string;
  snoozedUntil?: number;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  authProvider?: 'google' | 'apple' | 'email';
  supabaseId?: string;
  createdAt: number;
  updatedAt: number;
  lastSyncedAt?: number;
}

export interface AppSettings {
  id: string;
  userId: string;
  enableNotifications: boolean;
  enableCloudSync: boolean;
  theme: 'light' | 'dark' | 'system';
  defaultWellnessAxes: {
    mental: boolean;
    physical: boolean;
    emotional: boolean;
  };
  createdAt: number;
  updatedAt: number;
}
