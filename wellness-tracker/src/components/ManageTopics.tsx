import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import type { Topic, Axis } from '../types';

export function ManageTopics() {
  const { topics, axes, addTopic, updateTopic, deleteTopic, addAxis, updateAxis, deleteAxis } = useData();
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editingAxis, setEditingAxis] = useState<string | null>(null);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [showNewAxis, setShowNewAxis] = useState(false);

  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    icon: '',
    axisIds: [] as string[],
    includeWellnessCheck: false,
    color: '#60A5FA',
  });

  const [axisForm, setAxisForm] = useState({
    name: '',
    description: '',
    icon: '',
    minLabel: 'Low',
    maxLabel: 'High',
  });

  const handleAddTopic = async () => {
    if (!topicForm.name) return;
    await addTopic(topicForm);
    setTopicForm({
      name: '',
      description: '',
      icon: '',
      axisIds: [],
      includeWellnessCheck: false,
      color: '#60A5FA',
    });
    setShowNewTopic(false);
  };

  const handleUpdateTopic = async (id: string) => {
    await updateTopic(id, topicForm);
    setEditingTopic(null);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic.id);
    setTopicForm({
      name: topic.name,
      description: topic.description || '',
      icon: topic.icon || '',
      axisIds: topic.axisIds,
      includeWellnessCheck: topic.includeWellnessCheck,
      color: topic.color || '#60A5FA',
    });
  };

  const handleAddAxis = async () => {
    if (!axisForm.name) return;
    await addAxis(axisForm);
    setAxisForm({
      name: '',
      description: '',
      icon: '',
      minLabel: 'Low',
      maxLabel: 'High',
    });
    setShowNewAxis(false);
  };

  const handleUpdateAxis = async (id: string) => {
    await updateAxis(id, axisForm);
    setEditingAxis(null);
  };

  const handleEditAxis = (axis: Axis) => {
    setEditingAxis(axis.id);
    setAxisForm({
      name: axis.name,
      description: axis.description || '',
      icon: axis.icon || '',
      minLabel: axis.minLabel || 'Low',
      maxLabel: axis.maxLabel || 'High',
    });
  };

  return (
    <div className="space-y-8 pb-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Topics</h1>
          <button
            onClick={() => setShowNewTopic(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Topic
          </button>
        </div>

        {showNewTopic && (
          <div className="card mb-4 space-y-3">
            <input
              type="text"
              placeholder="Topic name"
              value={topicForm.name}
              onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Icon (emoji)"
              value={topicForm.icon}
              onChange={(e) => setTopicForm({ ...topicForm, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={topicForm.description}
              onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Axes</label>
              <div className="space-y-2">
                {axes.map(axis => (
                  <label key={axis.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={topicForm.axisIds.includes(axis.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTopicForm({ ...topicForm, axisIds: [...topicForm.axisIds, axis.id] });
                        } else {
                          setTopicForm({ ...topicForm, axisIds: topicForm.axisIds.filter(id => id !== axis.id) });
                        }
                      }}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span>{axis.icon} {axis.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={topicForm.includeWellnessCheck}
                onChange={(e) => setTopicForm({ ...topicForm, includeWellnessCheck: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Include wellness check</span>
            </label>

            <div className="flex gap-2">
              <button onClick={handleAddTopic} className="btn btn-primary flex-1">
                <Save className="w-4 h-4 mr-2 inline" />
                Save
              </button>
              <button onClick={() => setShowNewTopic(false)} className="btn btn-secondary flex-1">
                <X className="w-4 h-4 mr-2 inline" />
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {topics.map(topic => (
            <div key={topic.id} className="card">
              {editingTopic === topic.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={topicForm.name}
                    onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Icon (emoji)"
                    value={topicForm.icon}
                    onChange={(e) => setTopicForm({ ...topicForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateTopic(topic.id)} className="btn btn-primary flex-1">
                      Save
                    </button>
                    <button onClick={() => setEditingTopic(null)} className="btn btn-secondary flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{topic.icon || '📝'}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                      {topic.description && (
                        <p className="text-sm text-gray-600">{topic.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTopic(topic)}
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTopic(topic.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Manage Axes</h1>
          <button
            onClick={() => setShowNewAxis(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Axis
          </button>
        </div>

        {showNewAxis && (
          <div className="card mb-4 space-y-3">
            <input
              type="text"
              placeholder="Axis name"
              value={axisForm.name}
              onChange={(e) => setAxisForm({ ...axisForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Icon (emoji)"
              value={axisForm.icon}
              onChange={(e) => setAxisForm({ ...axisForm, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Min label"
                value={axisForm.minLabel}
                onChange={(e) => setAxisForm({ ...axisForm, minLabel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="text"
                placeholder="Max label"
                value={axisForm.maxLabel}
                onChange={(e) => setAxisForm({ ...axisForm, maxLabel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddAxis} className="btn btn-primary flex-1">
                <Save className="w-4 h-4 mr-2 inline" />
                Save
              </button>
              <button onClick={() => setShowNewAxis(false)} className="btn btn-secondary flex-1">
                <X className="w-4 h-4 mr-2 inline" />
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {axes.map(axis => (
            <div key={axis.id} className="card">
              {editingAxis === axis.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={axisForm.name}
                    onChange={(e) => setAxisForm({ ...axisForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Icon (emoji)"
                    value={axisForm.icon}
                    onChange={(e) => setAxisForm({ ...axisForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateAxis(axis.id)} className="btn btn-primary flex-1">
                      Save
                    </button>
                    <button onClick={() => setEditingAxis(null)} className="btn btn-secondary flex-1">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{axis.icon || '📊'}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{axis.name}</h3>
                      <p className="text-sm text-gray-600">
                        {axis.minLabel} → {axis.maxLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAxis(axis)}
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteAxis(axis.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
