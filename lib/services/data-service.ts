import { db } from '@/lib/db/dexie'
import { createClient } from '@/lib/supabase/client'

export interface TopicWithAxes {
  id: string
  userId: string
  name: string
  description?: string
  icon?: string
  color?: string
  isWellnessCheck: boolean
  sortOrder: number
  axes: Array<{
    axisId: string
    axisName: string
    axisIcon?: string
    isRequired: boolean
    sortOrder: number
  }>
}

export const topicService = {
  async getAll(userId: string): Promise<TopicWithAxes[]> {
    const topics = await db.topics
      .where('userId')
      .equals(userId)
      .sortBy('sortOrder')

    const topicsWithAxes = await Promise.all(
      topics.map(async (topic) => {
        const topicAxes = await db.topicAxes
          .where('topicId')
          .equals(topic.id!)
          .sortBy('sortOrder')

        const axes = await Promise.all(
          topicAxes.map(async (ta) => {
            const axis = await db.axes.get(ta.axisId)
            return {
              axisId: ta.axisId,
              axisName: axis?.name || '',
              axisIcon: axis?.icon,
              isRequired: ta.isRequired,
              sortOrder: ta.sortOrder,
            }
          })
        )

        return {
          ...topic,
          axes,
        }
      })
    )

    return topicsWithAxes as TopicWithAxes[]
  },

  async create(topic: Omit<TopicWithAxes, 'id' | 'createdAt' | 'updatedAt' | 'synced'>, axisIds: string[]) {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    await db.topics.add({
      id,
      userId: topic.userId,
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      color: topic.color,
      isWellnessCheck: topic.isWellnessCheck,
      sortOrder: topic.sortOrder,
      createdAt: now,
      updatedAt: now,
      synced: false,
    })

    // Link axes to topic
    await Promise.all(
      axisIds.map((axisId, index) =>
        db.topicAxes.add({
          id: crypto.randomUUID(),
          topicId: id,
          axisId,
          isRequired: false,
          sortOrder: index,
          createdAt: now,
          synced: false,
        })
      )
    )

    return id
  },

  async update(id: string, updates: Partial<TopicWithAxes>) {
    const now = new Date().toISOString()
    await db.topics.update(id, {
      ...updates,
      updatedAt: now,
      synced: false,
    })
  },

  async delete(id: string) {
    await db.topicAxes.where('topicId').equals(id).delete()
    await db.topics.delete(id)
  },

  async sync(userId: string) {
    const supabase = createClient()
    
    // Sync unsynced topics to Supabase
    const unsyncedTopics = await db.topics
      .where('synced')
      .equals(false)
      .toArray()

    for (const topic of unsyncedTopics) {
      const { error } = await supabase.from('topics').upsert({
        id: topic.id,
        user_id: topic.userId,
        name: topic.name,
        description: topic.description,
        icon: topic.icon,
        color: topic.color,
        is_wellness_check: topic.isWellnessCheck,
        sort_order: topic.sortOrder,
      })

      if (!error) {
        await db.topics.update(topic.id!, { synced: true })
      }
    }

    // Pull down topics from Supabase
    const { data: serverTopics } = await supabase
      .from('topics')
      .select('*')
      .eq('user_id', userId)

    if (serverTopics) {
      for (const serverTopic of serverTopics) {
        await db.topics.put({
          id: serverTopic.id,
          userId: serverTopic.user_id,
          name: serverTopic.name,
          description: serverTopic.description,
          icon: serverTopic.icon,
          color: serverTopic.color,
          isWellnessCheck: serverTopic.is_wellness_check,
          sortOrder: serverTopic.sort_order,
          createdAt: serverTopic.created_at,
          updatedAt: serverTopic.updated_at,
          synced: true,
        })
      }
    }
  },
}

export const axisService = {
  async getAll(userId: string) {
    return await db.axes
      .where('userId')
      .equals(userId)
      .sortBy('sortOrder')
  },

  async create(axis: Omit<typeof db.axes extends Table<infer T> ? T : never, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) {
    const now = new Date().toISOString()
    const id = crypto.randomUUID()

    await db.axes.add({
      id,
      ...axis,
      createdAt: now,
      updatedAt: now,
      synced: false,
    })

    return id
  },

  async update(id: string, updates: Partial<Parameters<typeof db.axes.update>[1]>) {
    const now = new Date().toISOString()
    await db.axes.update(id, {
      ...updates,
      updatedAt: now,
      synced: false,
    })
  },

  async delete(id: string) {
    await db.axes.delete(id)
  },

  async sync(userId: string) {
    const supabase = createClient()
    
    // Sync unsynced axes to Supabase
    const unsyncedAxes = await db.axes
      .where('synced')
      .equals(false)
      .toArray()

    for (const axis of unsyncedAxes) {
      const { error } = await supabase.from('axes').upsert({
        id: axis.id,
        user_id: axis.userId,
        name: axis.name,
        description: axis.description,
        icon: axis.icon,
        sort_order: axis.sortOrder,
      })

      if (!error) {
        await db.axes.update(axis.id!, { synced: true })
      }
    }

    // Pull down axes from Supabase
    const { data: serverAxes } = await supabase
      .from('axes')
      .select('*')
      .eq('user_id', userId)

    if (serverAxes) {
      for (const serverAxis of serverAxes) {
        await db.axes.put({
          id: serverAxis.id,
          userId: serverAxis.user_id,
          name: serverAxis.name,
          description: serverAxis.description,
          icon: serverAxis.icon,
          sortOrder: serverAxis.sort_order,
          createdAt: serverAxis.created_at,
          updatedAt: serverAxis.updated_at,
          synced: true,
        })
      }
    }
  },
}

export interface EventWithValues {
  id: string
  userId: string
  topicId: string
  topicName: string
  topicIcon?: string
  topicColor?: string
  notes?: string
  occurredAt: string
  values: Array<{
    axisId: string
    axisName: string
    axisIcon?: string
    value: number
  }>
}

export const eventService = {
  async getRecent(userId: string, limit = 50): Promise<EventWithValues[]> {
    const events = await db.events
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('occurredAt')

    const limitedEvents = events.slice(0, limit)

    const eventsWithValues = await Promise.all(
      limitedEvents.map(async (event) => {
        const topic = await db.topics.get(event.topicId)
        const eventValues = await db.eventValues
          .where('eventId')
          .equals(event.id!)
          .toArray()

        const values = await Promise.all(
          eventValues.map(async (ev) => {
            const axis = await db.axes.get(ev.axisId)
            return {
              axisId: ev.axisId,
              axisName: axis?.name || '',
              axisIcon: axis?.icon,
              value: ev.value,
            }
          })
        )

        return {
          ...event,
          topicName: topic?.name || '',
          topicIcon: topic?.icon,
          topicColor: topic?.color,
          values,
        }
      })
    )

    return eventsWithValues as EventWithValues[]
  },

  async create(
    userId: string,
    topicId: string,
    values: Array<{ axisId: string; value: number }>,
    notes?: string,
    occurredAt?: string
  ) {
    const now = new Date().toISOString()
    const eventId = crypto.randomUUID()

    await db.events.add({
      id: eventId,
      userId,
      topicId,
      notes,
      occurredAt: occurredAt || now,
      createdAt: now,
      updatedAt: now,
      synced: false,
    })

    await Promise.all(
      values.map((value) =>
        db.eventValues.add({
          id: crypto.randomUUID(),
          eventId,
          axisId: value.axisId,
          value: value.value,
          createdAt: now,
          synced: false,
        })
      )
    )

    return eventId
  },

  async sync(userId: string) {
    const supabase = createClient()
    
    // Sync unsynced events
    const unsyncedEvents = await db.events
      .where('synced')
      .equals(false)
      .toArray()

    for (const event of unsyncedEvents) {
      const { error } = await supabase.from('events').upsert({
        id: event.id,
        user_id: event.userId,
        topic_id: event.topicId,
        notes: event.notes,
        occurred_at: event.occurredAt,
      })

      if (!error) {
        await db.events.update(event.id!, { synced: true })

        // Sync event values
        const eventValues = await db.eventValues
          .where('eventId')
          .equals(event.id!)
          .toArray()

        for (const value of eventValues) {
          await supabase.from('event_values').upsert({
            id: value.id,
            event_id: value.eventId,
            axis_id: value.axisId,
            value: value.value,
          })

          await db.eventValues.update(value.id!, { synced: true })
        }
      }
    }
  },
}
