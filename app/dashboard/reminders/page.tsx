'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { reminderService } from '@/lib/services/reminder-service'
import { topicService } from '@/lib/services/data-service'
import type { TopicWithAxes } from '@/lib/services/data-service'
import type { ReminderSchedule } from '@/lib/services/reminder-service'
import { ArrowLeft, Plus, Trash2, Bell } from 'lucide-react'
import Link from 'next/link'

export default function RemindersPage() {
  const [user, setUser] = useState<any>(null)
  const [reminders, setReminders] = useState<(ReminderSchedule & { topicName: string })[]>([])
  const [topics, setTopics] = useState<TopicWithAxes[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  
  const [form, setForm] = useState({
    topicId: '',
    name: '',
    triggerType: 'time' as 'time' | 'event',
    triggerTime: '09:00',
    triggerEventTopicId: '',
    triggerOffsetMinutes: 45,
    maxTime: '',
    repeatCount: 0,
    repeatIntervalMinutes: 60,
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
    checkNotificationPermission()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const loadedReminders = await reminderService.getAll(user.id)
      const loadedTopics = await topicService.getAll(user.id)
      
      // Enrich reminders with topic names
      const enrichedReminders = await Promise.all(
        loadedReminders.map(async (r) => {
          const topic = loadedTopics.find((t) => t.id === r.topicId)
          return {
            ...r,
            topicName: topic?.name || 'Unknown',
          }
        })
      )
      
      setReminders(enrichedReminders as any)
      setTopics(loadedTopics)
    }
    setLoading(false)
  }

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }

  const handleRequestNotifications = async () => {
    const granted = await reminderService.requestNotificationPermission()
    setNotificationsEnabled(granted)
    if (!granted) {
      alert('Please enable notifications in your browser settings')
    }
  }

  const handleCreate = async () => {
    if (!user || !form.topicId || !form.name) return

    await reminderService.create({
      userId: user.id,
      topicId: form.topicId,
      name: form.name,
      triggerType: form.triggerType,
      triggerTime: form.triggerType === 'time' ? form.triggerTime : undefined,
      triggerEventTopicId: form.triggerType === 'event' ? form.triggerEventTopicId : undefined,
      triggerOffsetMinutes: form.triggerType === 'event' ? form.triggerOffsetMinutes : undefined,
      maxTime: form.maxTime || undefined,
      repeatCount: form.repeatCount,
      repeatIntervalMinutes: form.repeatCount > 0 ? form.repeatIntervalMinutes : undefined,
      isActive: true,
    })

    setShowForm(false)
    setForm({
      topicId: '',
      name: '',
      triggerType: 'time',
      triggerTime: '09:00',
      triggerEventTopicId: '',
      triggerOffsetMinutes: 45,
      maxTime: '',
      repeatCount: 0,
      repeatIntervalMinutes: 60,
    })
    await loadData()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await reminderService.delete(id)
      await loadData()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard/settings"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {!notificationsEnabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Notifications Disabled
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Enable notifications to receive reminders
                </p>
                <button
                  onClick={handleRequestNotifications}
                  className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  Enable Notifications
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{reminder.name}</h3>
                  <p className="text-sm text-gray-600">Topic: {reminder.topicName}</p>
                </div>
                <button
                  onClick={() => handleDelete(reminder.id!)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                {reminder.triggerType === 'time' ? (
                  <p>Daily at {reminder.triggerTime}</p>
                ) : (
                  <p>
                    {reminder.triggerOffsetMinutes} minutes after{' '}
                    {topics.find((t) => t.id === reminder.triggerEventTopicId)?.name}
                    {reminder.maxTime && ` (by ${reminder.maxTime})`}
                  </p>
                )}
                {reminder.repeatCount > 0 && (
                  <p className="mt-1">
                    Repeats {reminder.repeatCount}x every {reminder.repeatIntervalMinutes} min
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {showForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">New Reminder</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Take ADHD Meds"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic *
              </label>
              <select
                value={form.topicId}
                onChange={(e) => setForm({ ...form, topicId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.icon} {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trigger Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="time"
                    checked={form.triggerType === 'time'}
                    onChange={() => setForm({ ...form, triggerType: 'time' })}
                    className="mr-2"
                  />
                  <span className="text-sm">Time-based</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="event"
                    checked={form.triggerType === 'event'}
                    onChange={() => setForm({ ...form, triggerType: 'event' })}
                    className="mr-2"
                  />
                  <span className="text-sm">Event-based</span>
                </label>
              </div>
            </div>

            {form.triggerType === 'time' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={form.triggerTime}
                  onChange={(e) => setForm({ ...form, triggerTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    After Event
                  </label>
                  <select
                    value={form.triggerEventTopicId}
                    onChange={(e) => setForm({ ...form, triggerEventTopicId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select an event</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.icon} {topic.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offset (minutes)
                  </label>
                  <input
                    type="number"
                    value={form.triggerOffsetMinutes}
                    onChange={(e) => setForm({ ...form, triggerOffsetMinutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Time (optional)
                  </label>
                  <input
                    type="time"
                    value={form.maxTime}
                    onChange={(e) => setForm({ ...form, maxTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Latest time this reminder can fire (e.g., 9:30 AM)
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeat Count
              </label>
              <input
                type="number"
                min="0"
                value={form.repeatCount}
                onChange={(e) => setForm({ ...form, repeatCount: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {form.repeatCount > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat Interval (minutes)
                </label>
                <input
                  type="number"
                  value={form.repeatIntervalMinutes}
                  onChange={(e) => setForm({ ...form, repeatIntervalMinutes: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Reminder
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Reminder</span>
          </button>
        )}
      </main>
    </div>
  )
}
