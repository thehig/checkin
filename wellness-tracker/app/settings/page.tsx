'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useWellnessStore } from '@/lib/store';
import { db } from '@/lib/db';
import type { Topic, Axis, TopicAxis } from '@/lib/types';

export default function SettingsPage() {
  const { topics, axes, setTopics, setAxes, addTopic, addAxis, deleteTopic, deleteAxis } = useWellnessStore();
  const [activeTab, setActiveTab] = useState<'topics' | 'axes'>('topics');
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingAxis, setEditingAxis] = useState<Axis | null>(null);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showAxisForm, setShowAxisForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedTopics = await db.topics.toArray();
    const loadedAxes = await db.axes.toArray();
    const loadedTopicAxes = await db.topicAxes.toArray();

    const topicsWithAxes = loadedTopics.map((topic) => ({
      ...topic,
      axes: loadedTopicAxes
        .filter((ta) => ta.topic_id === topic.id)
        .map((ta) => ({
          ...ta,
          axis: loadedAxes.find((a) => a.id === ta.axis_id)!,
        })),
    }));

    setTopics(topicsWithAxes);
    setAxes(loadedAxes);
  };

  const handleSaveTopic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = 'demo-user'; // Replace with actual user ID

    const topic: Topic = {
      id: editingTopic?.id || crypto.randomUUID(),
      user_id: userId,
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
      description: formData.get('description') as string,
      is_wellness_check: false,
      created_at: editingTopic?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingTopic) {
      await db.topics.update(topic.id, topic);
    } else {
      await db.topics.add(topic);
      addTopic(topic);
    }

    setEditingTopic(null);
    setShowTopicForm(false);
    await loadData();
  };

  const handleSaveAxis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = 'demo-user'; // Replace with actual user ID

    const axis: Axis = {
      id: editingAxis?.id || crypto.randomUUID(),
      user_id: userId,
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      description: formData.get('description') as string,
      min_value: 0,
      max_value: 5,
      is_default: formData.get('is_default') === 'on',
      created_at: editingAxis?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingAxis) {
      await db.axes.update(axis.id, axis);
    } else {
      await db.axes.add(axis);
      addAxis(axis);
    }

    setEditingAxis(null);
    setShowAxisForm(false);
    await loadData();
  };

  const handleDeleteTopic = async (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      await db.topics.delete(id);
      deleteTopic(id);
      await loadData();
    }
  };

  const handleDeleteAxis = async (id: string) => {
    if (confirm('Are you sure you want to delete this axis?')) {
      await db.axes.delete(id);
      deleteAxis(id);
      await loadData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your topics and scales</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'topics'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Topics
          </button>
          <button
            onClick={() => setActiveTab('axes')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'axes'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Scales
          </button>
        </div>

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowTopicForm(true)}
              className="w-full flex items-center justify-center gap-2 p-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Topic
            </button>

            {showTopicForm && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingTopic ? 'Edit Topic' : 'New Topic'}
                </h3>
                <form onSubmit={handleSaveTopic} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingTopic?.name}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      name="icon"
                      defaultValue={editingTopic?.icon}
                      placeholder="☕"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      defaultValue={editingTopic?.color}
                      placeholder="#3b82f6"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingTopic?.description}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTopicForm(false);
                        setEditingTopic(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
                >
                  {topic.icon && <span className="text-2xl">{topic.icon}</span>}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{topic.name}</h4>
                    {topic.description && (
                      <p className="text-sm text-gray-600">{topic.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setEditingTopic(topic);
                      setShowTopicForm(true);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Axes Tab */}
        {activeTab === 'axes' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowAxisForm(true)}
              className="w-full flex items-center justify-center gap-2 p-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Scale
            </button>

            {showAxisForm && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingAxis ? 'Edit Scale' : 'New Scale'}
                </h3>
                <form onSubmit={handleSaveAxis} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingAxis?.name}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      name="icon"
                      defaultValue={editingAxis?.icon}
                      placeholder="⚡"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingAxis?.description}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_default"
                      id="is_default"
                      defaultChecked={editingAxis?.is_default}
                      className="w-4 h-4 text-blue-500 rounded"
                    />
                    <label htmlFor="is_default" className="text-sm text-gray-700">
                      Default wellness scale (Mental/Physical/Emotional)
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAxisForm(false);
                        setEditingAxis(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {axes.map((axis) => (
                <div
                  key={axis.id}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
                >
                  {axis.icon && <span className="text-2xl">{axis.icon}</span>}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {axis.name}
                      {axis.is_default && (
                        <span className="ml-2 text-xs text-blue-500 font-normal">
                          (Default)
                        </span>
                      )}
                    </h4>
                    {axis.description && (
                      <p className="text-sm text-gray-600">{axis.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setEditingAxis(axis);
                      setShowAxisForm(true);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAxis(axis.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
