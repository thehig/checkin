'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { topicService, axisService, type TopicWithAxes } from '@/lib/services/data-service'
import type { Axis } from '@/lib/db/dexie'
import { ArrowLeft, Plus, Trash2, Edit2, GripVertical, Bell } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [topics, setTopics] = useState<TopicWithAxes[]>([])
  const [axes, setAxes] = useState<Axis[]>([])
  const [activeTab, setActiveTab] = useState<'topics' | 'axes' | 'reminders'>('topics')
  const [loading, setLoading] = useState(true)
  
  // Topic form state
  const [showTopicForm, setShowTopicForm] = useState(false)
  const [editingTopic, setEditingTopic] = useState<TopicWithAxes | null>(null)
  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#6366f1',
    isWellnessCheck: false,
    selectedAxes: [] as string[],
  })

  // Axis form state
  const [showAxisForm, setShowAxisForm] = useState(false)
  const [editingAxis, setEditingAxis] = useState<Axis | null>(null)
  const [axisForm, setAxisForm] = useState({
    name: '',
    description: '',
    icon: '',
  })

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      const loadedTopics = await topicService.getAll(user.id)
      const loadedAxes = await axisService.getAll(user.id)
      setTopics(loadedTopics)
      setAxes(loadedAxes)
    }
    setLoading(false)
  }

  const handleCreateTopic = async () => {
    if (!user || !topicForm.name) return

    const sortOrder = topics.length + 1
    await topicService.create(
      {
        userId: user.id,
        name: topicForm.name,
        description: topicForm.description || undefined,
        icon: topicForm.icon || '📝',
        color: topicForm.color,
        isWellnessCheck: topicForm.isWellnessCheck,
        sortOrder,
        axes: [],
      },
      topicForm.selectedAxes
    )

    setShowTopicForm(false)
    setTopicForm({
      name: '',
      description: '',
      icon: '',
      color: '#6366f1',
      isWellnessCheck: false,
      selectedAxes: [],
    })
    await loadData()
  }

  const handleDeleteTopic = async (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      await topicService.delete(id)
      await loadData()
    }
  }

  const handleCreateAxis = async () => {
    if (!user || !axisForm.name) return

    const sortOrder = axes.length + 1
    await axisService.create({
      userId: user.id,
      name: axisForm.name,
      description: axisForm.description || undefined,
      icon: axisForm.icon || '📊',
      sortOrder,
    })

    setShowAxisForm(false)
    setAxisForm({ name: '', description: '', icon: '' })
    await loadData()
  }

  const handleDeleteAxis = async (id: string) => {
    if (confirm('Are you sure you want to delete this axis? This will affect all topics using it.')) {
      await axisService.delete(id)
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 px-4 py-3 font-semibold rounded-xl transition-all ${
              activeTab === 'topics'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Topics
          </button>
          <button
            onClick={() => setActiveTab('axes')}
            className={`flex-1 px-4 py-3 font-semibold rounded-xl transition-all ${
              activeTab === 'axes'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Axes
          </button>
          <Link
            href="/dashboard/reminders"
            className="flex-1 px-4 py-3 font-semibold rounded-xl text-center text-gray-600 hover:bg-white/50 transition-all"
          >
            <Bell className="w-5 h-5 inline-block mr-1" />
            Reminders
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pb-6">
        {activeTab === 'topics' && (
          <div>
            {/* Topic List */}
            <div className="space-y-3 mb-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4"
                >
                  <span className="text-3xl">{topic.icon || '📝'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                    <p className="text-sm text-gray-500">
                      {topic.axes.length} {topic.axes.length === 1 ? 'axis' : 'axes'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Topic Form */}
            {showTopicForm ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">New Topic</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={topicForm.name}
                    onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Breakfast"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={topicForm.icon}
                    onChange={(e) => setTopicForm({ ...topicForm, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="🍳"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={topicForm.description}
                    onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Morning meal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Axes
                  </label>
                  <div className="space-y-2">
                    {axes.map((axis) => (
                      <label key={axis.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={topicForm.selectedAxes.includes(axis.id!)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTopicForm({
                                ...topicForm,
                                selectedAxes: [...topicForm.selectedAxes, axis.id!],
                              })
                            } else {
                              setTopicForm({
                                ...topicForm,
                                selectedAxes: topicForm.selectedAxes.filter((id) => id !== axis.id),
                              })
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
                          {axis.icon} {axis.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCreateTopic}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create Topic
                  </button>
                  <button
                    onClick={() => {
                      setShowTopicForm(false)
                      setTopicForm({
                        name: '',
                        description: '',
                        icon: '',
                        color: '#6366f1',
                        isWellnessCheck: false,
                        selectedAxes: [],
                      })
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTopicForm(true)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Topic</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'axes' && (
          <div>
            {/* Axis List */}
            <div className="space-y-3 mb-4">
              {axes.map((axis) => (
                <div
                  key={axis.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4"
                >
                  <span className="text-3xl">{axis.icon || '📊'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{axis.name}</h3>
                    {axis.description && (
                      <p className="text-sm text-gray-500">{axis.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteAxis(axis.id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Axis Form */}
            {showAxisForm ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">New Axis</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={axisForm.name}
                    onChange={(e) => setAxisForm({ ...axisForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Protein"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={axisForm.icon}
                    onChange={(e) => setAxisForm({ ...axisForm, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="🥩"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={axisForm.description}
                    onChange={(e) => setAxisForm({ ...axisForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Protein content"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCreateAxis}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create Axis
                  </button>
                  <button
                    onClick={() => {
                      setShowAxisForm(false)
                      setAxisForm({ name: '', description: '', icon: '' })
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAxisForm(true)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Axis</span>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
