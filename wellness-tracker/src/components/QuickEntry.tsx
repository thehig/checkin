import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import type { Topic, EventAxis } from '../types';
import { Check } from 'lucide-react';

export function QuickEntry() {
  const { topics, getAxesByTopic, addEvent } = useData();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [axisValues, setAxisValues] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    // Initialize axis values
    const topicAxes = getAxesByTopic(topic.id);
    const initialValues: Record<string, number> = {};
    topicAxes.forEach(axis => {
      initialValues[axis.id] = 3;
    });
    setAxisValues(initialValues);
  };

  const handleSubmit = async () => {
    if (!selectedTopic) return;

    const topicAxes = getAxesByTopic(selectedTopic.id);
    const eventAxes: EventAxis[] = topicAxes.map(axis => ({
      axisId: axis.id,
      value: axisValues[axis.id] || 3,
    }));

    await addEvent({
      topicId: selectedTopic.id,
      timestamp: Date.now(),
      axes: eventAxes,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSelectedTopic(null);
    setAxisValues({});
    setNotes('');
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCancel = () => {
    setSelectedTopic(null);
    setAxisValues({});
    setNotes('');
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-green-100 text-green-800 rounded-full p-4 mb-4">
          <Check className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Logged!</h2>
        <p className="text-gray-600 mt-2">Event saved successfully</p>
      </div>
    );
  }

  if (!selectedTopic) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">What happened?</h1>
          <p className="text-gray-600 mt-1">Select a topic to log</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className="card hover:shadow-md transition-all p-6 text-center space-y-2"
              style={{ borderColor: topic.color }}
            >
              <div className="text-4xl">{topic.icon || '📝'}</div>
              <div className="font-semibold text-gray-900">{topic.name}</div>
              {topic.description && (
                <div className="text-xs text-gray-500">{topic.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const topicAxes = getAxesByTopic(selectedTopic.id);

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center">
        <div className="text-5xl mb-2">{selectedTopic.icon || '📝'}</div>
        <h1 className="text-2xl font-bold text-gray-900">{selectedTopic.name}</h1>
        {selectedTopic.description && (
          <p className="text-gray-600 mt-1">{selectedTopic.description}</p>
        )}
      </div>

      {topicAxes.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900">How was it?</h2>
          {topicAxes.map(axis => (
            <div key={axis.id} className="card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{axis.icon}</span>
                  <span className="font-medium text-gray-900">{axis.name}</span>
                </div>
                <span className="text-xl font-bold text-primary-600">
                  {(axisValues[axis.id] || 3).toFixed(1)}
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={axisValues[axis.id] || 3}
                onChange={(e) => setAxisValues({ ...axisValues, [axis.id]: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{axis.minLabel || 'Low'}</span>
                <span>{axis.maxLabel || 'High'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handleCancel}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary flex-1"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}
