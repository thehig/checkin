'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { eventService, type EventWithValues } from '@/lib/services/data-service'
import { ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<EventWithValues[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const loadedEvents = await eventService.getRecent(user.id, 100)
        setEvents(loadedEvents)
      }
      setLoading(false)
    }

    loadData()
  }, [])

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No entries yet</p>
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create your first entry
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{event.topicIcon || '📝'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {event.topicName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {format(new Date(event.occurredAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>

                    {event.values.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {event.values.map((value, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {value.axisIcon && (
                              <span className="text-sm">{value.axisIcon}</span>
                            )}
                            <span className="text-sm text-gray-600">
                              {value.axisName}:
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {value.value.toFixed(1)}/5.0
                            </span>
                            {/* Visual indicator */}
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                                style={{ width: `${(value.value / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {event.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        {event.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
