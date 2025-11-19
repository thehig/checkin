'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { topicService, axisService, eventService, type TopicWithAxes } from '@/lib/services/data-service'
import { db } from '@/lib/db/dexie'
import { Plus, Settings, History, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [topics, setTopics] = useState<TopicWithAxes[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // Initialize default data if none exists
        const existingTopics = await db.topics.where('userId').equals(user.id).count()
        
        if (existingTopics === 0) {
          await initializeDefaultData(user.id)
        }
        
        // Load topics
        const loadedTopics = await topicService.getAll(user.id)
        setTopics(loadedTopics)
      }
      setLoading(false)
    }

    initializeData()
  }, [])

  const initializeDefaultData = async (userId: string) => {
    const now = new Date().toISOString()
    
    // Create default axes
    const mentalAxisId = await axisService.create({
      userId,
      name: 'Mental',
      description: 'Mental well-being and clarity',
      icon: '🧠',
      sortOrder: 1,
    })

    const physicalAxisId = await axisService.create({
      userId,
      name: 'Physical',
      description: 'Physical health and energy',
      icon: '💪',
      sortOrder: 2,
    })

    const emotionalAxisId = await axisService.create({
      userId,
      name: 'Emotional',
      description: 'Emotional state and mood',
      icon: '❤️',
      sortOrder: 3,
    })

    // Create default wellness check topic
    await topicService.create(
      {
        userId,
        name: 'Wellness Check',
        description: 'Quick check-in on overall wellbeing',
        icon: '✨',
        color: '#6366f1',
        isWellnessCheck: true,
        sortOrder: 1,
        axes: [],
      },
      [mentalAxisId, physicalAxisId, emotionalAxisId]
    )

    // Create wake up topic
    await topicService.create(
      {
        userId,
        name: 'Wake Up',
        description: 'Morning wake up time',
        icon: '🌅',
        color: '#f59e0b',
        isWellnessCheck: false,
        sortOrder: 2,
        axes: [],
      },
      []
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Wellness Tracker</h1>
          <div className="flex gap-2">
            <Link
              href="/dashboard/history"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <History className="w-6 h-6" />
            </Link>
            <Link
              href="/dashboard/settings"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Entry</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select a topic to quickly log an entry
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/dashboard/entry/${topic.id}`}
              className="group"
            >
              <div
                className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-md"
                style={{
                  borderColor: topic.color ? `${topic.color}20` : undefined,
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{topic.icon || '📝'}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {topic.axes.length} {topic.axes.length === 1 ? 'axis' : 'axes'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Add Topic Button */}
        <Link
          href="/dashboard/topics"
          className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Topic</span>
        </Link>
      </main>
    </div>
  )
}
