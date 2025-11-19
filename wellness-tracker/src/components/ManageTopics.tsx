import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import type { Topic, Axis } from '../types';

export function ManageTopics() {
  const { topics, getAxesByTopic, addTopic, updateTopic, deleteTopic, addAxis, updateAxis, deleteAxis } = useData();
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editingAxis, setEditingAxis] = useState<string | null>(null);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [showNewAxisForTopic, setShowNewAxisForTopic] = useState<string | null>(null);

  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    icon: '',
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
      color: topic.color || '#60A5FA',
    });
  };

  const handleAddAxis = async (topicId: string) => {
    if (!axisForm.name) return;
    await addAxis({
      ...axisForm,
      topicId,
    });
    setAxisForm({
      name: '',
      description: '',
      icon: '',
      minLabel: 'Low',
      maxLabel: 'High',
    });
    setShowNewAxisForTopic(null);
  };

  const handleUpdateAxis = async (id: string) => {
    const axis = getAxesByTopic(expandedTopic || '').find(a => a.id === id);
    if (!axis) return;
    
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

  const isWellnessTopic = (topicId: string) => topicId === 'topic-wellness';
  const isWellnessAxis = (axisId: string) => ['axis-mental', 'axis-physical', 'axis-emotional'].includes(axisId);

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="color"
                value={topicForm.color}
                onChange={(e) => setTopicForm({ ...topicForm, color: e.target.value })}
                className="h-10 w-20 rounded cursor-pointer"
              />
            </div>

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
          {topics.map(topic => {
            const topicAxes = getAxesByTopic(topic.id);
            const isExpanded = expandedTopic === topic.id;
            const isProtected = isWellnessTopic(topic.id);

            return (
              <div key={topic.id} className="card">
                {editingTopic === topic.id && !isProtected ? (
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
                  <>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="text-3xl">{topic.icon || '📝'}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {topic.name}
                            {isProtected && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Protected
                              </span>
                            )}
                          </h3>
                          {topic.description && (
                            <p className="text-sm text-gray-600">{topic.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {topicAxes.length} {topicAxes.length === 1 ? 'axis' : 'axes'}
                          </p>
                        </div>
                      </button>
                      <div className="flex gap-2">
                        {!isProtected && (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pl-8 space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Axes</h4>
                          {!isProtected && (
                            <button
                              onClick={() => setShowNewAxisForTopic(topic.id)}
                              className="text-sm btn btn-primary flex items-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              Add Axis
                            </button>
                          )}
                        </div>

                        {showNewAxisForTopic === topic.id && (
                          <div className="card bg-gray-50 space-y-3">
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
                              <button onClick={() => handleAddAxis(topic.id)} className="btn btn-primary flex-1 text-sm">
                                <Save className="w-3 h-3 mr-1 inline" />
                                Save
                              </button>
                              <button onClick={() => setShowNewAxisForTopic(null)} className="btn btn-secondary flex-1 text-sm">
                                <X className="w-3 h-3 mr-1 inline" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {topicAxes.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">No axes yet</p>
                        ) : (
                          <div className="space-y-2">
                            {topicAxes.map(axis => {
                              const isAxisProtected = isWellnessAxis(axis.id);
                              
                              return (
                                <div key={axis.id} className="bg-gray-50 rounded-lg p-3">
                                  {editingAxis === axis.id && !isAxisProtected ? (
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        value={axisForm.name}
                                        onChange={(e) => setAxisForm({ ...axisForm, name: e.target.value })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Icon (emoji)"
                                        value={axisForm.icon}
                                        onChange={(e) => setAxisForm({ ...axisForm, icon: e.target.value })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                      <div className="flex gap-2">
                                        <button onClick={() => handleUpdateAxis(axis.id)} className="btn btn-primary flex-1 text-xs py-1">
                                          Save
                                        </button>
                                        <button onClick={() => setEditingAxis(null)} className="btn btn-secondary flex-1 text-xs py-1">
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xl">{axis.icon || '📊'}</span>
                                        <div>
                                          <div className="font-medium text-gray-900 text-sm">{axis.name}</div>
                                          <div className="text-xs text-gray-500">
                                            {axis.minLabel} → {axis.maxLabel}
                                          </div>
                                        </div>
                                      </div>
                                      {!isAxisProtected && (
                                        <div className="flex gap-1">
                                          <button
                                            onClick={() => handleEditAxis(axis)}
                                            className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
                                          >
                                            <Edit2 className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => deleteAxis(axis.id)}
                                            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
