'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { topicService, eventService, type TopicWithAxes } from '@/lib/services/data-service'
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

export default function EntryPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topicId as string
  const supabase = createClient()

  const [user, setUser] = useState<any>(null)
  const [topic, setTopic] = useState<TopicWithAxes | null>(null)
  const [values, setValues] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const topics = await topicService.getAll(user.id)
        const foundTopic = topics.find((t) => t.id === topicId)
        setTopic(foundTopic || null)

        // Initialize values at 3.0 (middle value)
        const initialValues: Record<string, number> = {}
        foundTopic?.axes.forEach((axis) => {
          initialValues[axis.axisId] = 3.0
        })
        setValues(initialValues)
      }
      setLoading(false)
    }

    loadData()
  }, [topicId])

  const handleSliderChange = (axisId: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      [axisId]: value,
    }))
  }

  const handleSave = async () => {
    if (!user || !topic) return

    setSaving(true)
    try {
      const eventValues = Object.entries(values).map(([axisId, value]) => ({
        axisId,
        value,
      }))

      await eventService.create(
        user.id,
        topic.id,
        eventValues,
        notes || undefined
      )

      // Navigate back to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save entry. Please try again.')
    } finally {
      setSaving(false)
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

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Topic not found</p>
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Return to Dashboard
          </Link>
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
          <div className="flex items-center gap-3">
            <span className="text-3xl">{topic.icon || '📝'}</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{topic.name}</h1>
              {topic.description && (
                <p className="text-sm text-gray-600">{topic.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {topic.axes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                This topic has no axes configured.
              </p>
              <Link
                href="/dashboard/settings"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Configure in Settings
              </Link>
            </div>
          ) : (
            <>
              {/* Axes Sliders */}
              <div className="space-y-8 mb-8">
                {topic.axes.map((axis) => (
                  <div key={axis.axisId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {axis.axisIcon && (
                          <span className="text-2xl">{axis.axisIcon}</span>
                        )}
                        <label className="font-semibold text-gray-900">
                          {axis.axisName}
                        </label>
                      </div>
                      <span className="text-2xl font-bold text-indigo-600">
                        {values[axis.axisId]?.toFixed(1) || '3.0'}
                      </span>
                    </div>

                    {/* Custom Slider */}
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={values[axis.axisId] || 3.0}
                        onChange={(e) =>
                          handleSliderChange(axis.axisId, parseFloat(e.target.value))
                        }
                        className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer slider"
                        style={{
                          WebkitAppearance: 'none',
                        }}
                      />
                      {/* Value markers */}
                      <div className="flex justify-between mt-2 px-1">
                        {[0, 1, 2, 3, 4, 5].map((mark) => (
                          <span
                            key={mark}
                            className="text-xs text-gray-400 font-medium"
                          >
                            {mark}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-900 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Save Entry</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          background: white;
          border: 3px solid #4f46e5;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: white;
          border: 3px solid #4f46e5;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  )
}
