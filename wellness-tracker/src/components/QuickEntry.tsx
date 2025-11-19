import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import type { Topic, EventAxis } from '../types';
import { Check, GripVertical } from 'lucide-react';

export function QuickEntry() {
  const { topics, getAxesByTopic, addEvent, reorderTopics, syncStatus } = useData();
  const { showSuccess, showError } = useNotification();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [axisValues, setAxisValues] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const getSyncIndicatorColor = () => {
    switch (syncStatus) {
      case 'synced':
        return 'bg-green-500';
      case 'syncing':
      case 'offline':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getSyncIndicatorTitle = () => {
    switch (syncStatus) {
      case 'synced':
        return 'All synced';
      case 'syncing':
        return 'Syncing...';
      case 'offline':
        return 'Offline';
      case 'error':
        return 'Sync error';
      default:
        return 'Unknown';
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...topics];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, removed);

    try {
      await reorderTopics(reordered);
      // Removed success notification - visual reordering is feedback enough
    } catch (error) {
      showError('Failed to reorder topics');
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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

    try {
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
      showSuccess('Event logged successfully!');
      setShowSuccessScreen(true);
      setTimeout(() => setShowSuccessScreen(false), 2000);
    } catch (error) {
      showError(`Failed to log event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setSelectedTopic(null);
    setAxisValues({});
    setNotes('');
  };

  if (showSuccessScreen) {
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
      <section className="space-y-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">What happened?</h1>
            <div 
              className={`w-3 h-3 rounded-full ${getSyncIndicatorColor()} animate-pulse`}
              title={getSyncIndicatorTitle()}
              aria-label={getSyncIndicatorTitle()}
              role="status"
            />
          </div>
          <p className="text-gray-600 mt-1">Select a topic to log</p>
          <p className="text-sm text-gray-500 mt-2">Drag to reorder</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative ${
                dragOverIndex === index && draggedIndex !== index
                  ? 'ring-2 ring-primary-500'
                  : ''
              }`}
            >
              <button
                onClick={() => handleTopicSelect(topic)}
                className={`card hover:shadow-md transition-all p-6 text-center space-y-2 w-full focus-outline ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
                style={{ borderColor: topic.color }}
                aria-label={`Select ${topic.name} topic`}
              >
                <div 
                  className="absolute top-2 left-2 text-gray-400 cursor-move p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Drag to reorder topic"
                >
                  <GripVertical className="w-6 h-6" />
                </div>
                <div className="text-4xl">{topic.icon || '📝'}</div>
                <div className="font-semibold text-gray-900">{topic.name}</div>
                {topic.description && (
                  <div className="text-sm text-gray-500">{topic.description}</div>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const topicAxes = getAxesByTopic(selectedTopic.id);

  return (
    <div className="space-y-8 pb-32">
      <div className="text-center">
        <div className="text-5xl mb-2">{selectedTopic.icon || '📝'}</div>
        <h1 className="text-2xl font-bold text-gray-900">{selectedTopic.name}</h1>
        {selectedTopic.description && (
          <p className="text-gray-600 mt-1">{selectedTopic.description}</p>
        )}
      </div>

      {topicAxes.length > 0 && (
        <fieldset className="space-y-4">
          <legend className="font-semibold text-gray-900 mb-2">How was it?</legend>
          {topicAxes.map(axis => (
            <div key={axis.id} className="card space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{axis.icon}</span>
                  <span className="font-medium text-gray-900">{axis.name}</span>
                </div>
                <span className="text-2xl font-bold text-primary-600 min-w-[60px] text-right">
                  {(axisValues[axis.id] || 3).toFixed(1)}
                </span>
              </div>
              
              <div className="py-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={axisValues[axis.id] || 3}
                  onChange={(e) => setAxisValues({ ...axisValues, [axis.id]: parseFloat(e.target.value) })}
                  className="w-full"
                  aria-label={`${axis.name} value: ${(axisValues[axis.id] || 3).toFixed(1)} out of 5`}
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-valuenow={axisValues[axis.id] || 3}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>{axis.minLabel || 'Low'}</span>
                <span>{axis.maxLabel || 'High'}</span>
              </div>
            </div>
          ))}
        </fieldset>
      )}

      <div className="card p-6">
        <label htmlFor="event-notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea
          id="event-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[44px] focus-outline"
        />
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handleCancel}
            className="btn btn-secondary flex-1"
            aria-label="Cancel and return to topic selection"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary flex-1"
            aria-label="Save this event"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}
