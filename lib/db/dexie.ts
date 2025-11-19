import Dexie, { Table } from 'dexie'

export interface Axis {
  id?: string
  userId: string
  name: string
  description?: string
  icon?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
  synced?: boolean
}

export interface Topic {
  id?: string
  userId: string
  name: string
  description?: string
  icon?: string
  color?: string
  isWellnessCheck: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  synced?: boolean
}

export interface TopicAxis {
  id?: string
  topicId: string
  axisId: string
  isRequired: boolean
  sortOrder: number
  createdAt: string
  synced?: boolean
}

export interface Event {
  id?: string
  userId: string
  topicId: string
  notes?: string
  occurredAt: string
  createdAt: string
  updatedAt: string
  synced?: boolean
}

export interface EventValue {
  id?: string
  eventId: string
  axisId: string
  value: number
  createdAt: string
  synced?: boolean
}

export interface Reminder {
  id?: string
  userId: string
  topicId: string
  name: string
  triggerType: 'time' | 'event'
  triggerTime?: string
  triggerEventTopicId?: string
  triggerOffsetMinutes?: number
  maxTime?: string
  repeatCount: number
  repeatIntervalMinutes?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  synced?: boolean
}

export interface ScheduledReminder {
  id?: string
  userId: string
  reminderId: string
  scheduledFor: string
  status: 'pending' | 'snoozed' | 'completed' | 'dismissed'
  snoozedUntil?: string
  completedAt?: string
  eventId?: string
  createdAt: string
  updatedAt: string
  synced?: boolean
}

export class WellnessDB extends Dexie {
  axes!: Table<Axis>
  topics!: Table<Topic>
  topicAxes!: Table<TopicAxis>
  events!: Table<Event>
  eventValues!: Table<EventValue>
  reminders!: Table<Reminder>
  scheduledReminders!: Table<ScheduledReminder>

  constructor() {
    super('WellnessDB')
    this.version(1).stores({
      axes: '&id, userId, sortOrder, synced',
      topics: '&id, userId, isWellnessCheck, sortOrder, synced',
      topicAxes: '&id, topicId, axisId, synced',
      events: '&id, userId, topicId, occurredAt, synced',
      eventValues: '&id, eventId, axisId, synced',
      reminders: '&id, userId, topicId, isActive, synced',
      scheduledReminders: '&id, userId, reminderId, scheduledFor, status, synced',
    })
  }
}

export const db = new WellnessDB()
