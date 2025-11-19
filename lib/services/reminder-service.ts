import { db } from '@/lib/db/dexie'
import { createClient } from '@/lib/supabase/client'

export interface ReminderSchedule {
  id: string
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
}

export const reminderService = {
  async getAll(userId: string) {
    return await db.reminders
      .where('userId')
      .equals(userId)
      .and((r) => r.isActive)
      .toArray()
  },

  async create(reminder: Omit<ReminderSchedule, 'id'>) {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    await db.reminders.add({
      id,
      ...reminder,
      createdAt: now,
      updatedAt: now,
      synced: false,
    })

    return id
  },

  async update(id: string, updates: Partial<ReminderSchedule>) {
    const now = new Date().toISOString()
    await db.reminders.update(id, {
      ...updates,
      updatedAt: now,
      synced: false,
    })
  },

  async delete(id: string) {
    await db.reminders.delete(id)
    await db.scheduledReminders.where('reminderId').equals(id).delete()
  },

  async scheduleFromEvent(eventTopicId: string, userId: string) {
    const now = new Date()
    
    // Find reminders triggered by this event
    const reminders = await db.reminders
      .where('triggerEventTopicId')
      .equals(eventTopicId)
      .and((r) => r.isActive && r.userId === userId)
      .toArray()

    for (const reminder of reminders) {
      const scheduledFor = new Date(now.getTime() + (reminder.triggerOffsetMinutes || 0) * 60000)

      // Check if there's a max time constraint
      if (reminder.maxTime) {
        const [hours, minutes] = reminder.maxTime.split(':').map(Number)
        const maxTimeToday = new Date(now)
        maxTimeToday.setHours(hours, minutes, 0, 0)

        // If scheduled time exceeds max time, use max time instead
        if (scheduledFor > maxTimeToday) {
          scheduledFor.setTime(maxTimeToday.getTime())
        }
      }

      // Create scheduled reminder
      await db.scheduledReminders.add({
        id: crypto.randomUUID(),
        userId,
        reminderId: reminder.id!,
        scheduledFor: scheduledFor.toISOString(),
        status: 'pending',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        synced: false,
      })

      // Handle repeating reminders
      if (reminder.repeatCount > 0 && reminder.repeatIntervalMinutes) {
        for (let i = 1; i <= reminder.repeatCount; i++) {
          const repeatTime = new Date(
            scheduledFor.getTime() + i * reminder.repeatIntervalMinutes * 60000
          )

          await db.scheduledReminders.add({
            id: crypto.randomUUID(),
            userId,
            reminderId: reminder.id!,
            scheduledFor: repeatTime.toISOString(),
            status: 'pending',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            synced: false,
          })
        }
      }
    }
  },

  async getPendingReminders(userId: string) {
    const now = new Date().toISOString()
    
    const scheduled = await db.scheduledReminders
      .where('userId')
      .equals(userId)
      .and((sr) => sr.status === 'pending' || sr.status === 'snoozed')
      .toArray()

    // Get reminders with their topic info
    const remindersWithInfo = await Promise.all(
      scheduled.map(async (sr) => {
        const reminder = await db.reminders.get(sr.reminderId)
        const topic = reminder ? await db.topics.get(reminder.topicId) : null

        return {
          ...sr,
          reminderName: reminder?.name || '',
          topicId: reminder?.topicId || '',
          topicName: topic?.name || '',
          topicIcon: topic?.icon || '',
        }
      })
    )

    // Filter by scheduled time (due now or overdue)
    return remindersWithInfo.filter((r) => r.scheduledFor <= now)
  },

  async snoozeReminder(id: string, minutes: number) {
    const now = new Date()
    const snoozedUntil = new Date(now.getTime() + minutes * 60000)

    await db.scheduledReminders.update(id, {
      status: 'snoozed',
      snoozedUntil: snoozedUntil.toISOString(),
      updatedAt: now.toISOString(),
      synced: false,
    })
  },

  async completeReminder(id: string, eventId?: string) {
    const now = new Date()

    await db.scheduledReminders.update(id, {
      status: 'completed',
      completedAt: now.toISOString(),
      eventId,
      updatedAt: now.toISOString(),
      synced: false,
    })
  },

  async dismissReminder(id: string) {
    const now = new Date()

    await db.scheduledReminders.update(id, {
      status: 'dismissed',
      updatedAt: now.toISOString(),
      synced: false,
    })
  },

  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  },

  async showNotification(title: string, body: string, tag?: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: tag || 'wellness-reminder',
        requireInteraction: true,
        vibrate: [200, 100, 200],
      })
    }
  },

  async sync(userId: string) {
    const supabase = createClient()
    
    // Sync unsynced reminders
    const unsyncedReminders = await db.reminders
      .where('synced')
      .equals(false)
      .toArray()

    for (const reminder of unsyncedReminders) {
      const { error } = await supabase.from('reminders').upsert({
        id: reminder.id,
        user_id: reminder.userId,
        topic_id: reminder.topicId,
        name: reminder.name,
        trigger_type: reminder.triggerType,
        trigger_time: reminder.triggerTime,
        trigger_event_topic_id: reminder.triggerEventTopicId,
        trigger_offset_minutes: reminder.triggerOffsetMinutes,
        max_time: reminder.maxTime,
        repeat_count: reminder.repeatCount,
        repeat_interval_minutes: reminder.repeatIntervalMinutes,
        is_active: reminder.isActive,
      })

      if (!error) {
        await db.reminders.update(reminder.id!, { synced: true })
      }
    }

    // Sync scheduled reminders
    const unsyncedScheduled = await db.scheduledReminders
      .where('synced')
      .equals(false)
      .toArray()

    for (const scheduled of unsyncedScheduled) {
      await supabase.from('scheduled_reminders').upsert({
        id: scheduled.id,
        user_id: scheduled.userId,
        reminder_id: scheduled.reminderId,
        scheduled_for: scheduled.scheduledFor,
        status: scheduled.status,
        snoozed_until: scheduled.snoozedUntil,
        completed_at: scheduled.completedAt,
        event_id: scheduled.eventId,
      })

      await db.scheduledReminders.update(scheduled.id!, { synced: true })
    }
  },
}
