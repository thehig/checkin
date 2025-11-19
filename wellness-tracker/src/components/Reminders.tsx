import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Bell, Plus, Trash2, Clock, CheckCircle, X as XIcon } from 'lucide-react';
import { format } from 'date-fns';

export function Reminders() {
  const { reminders, reminderInstances, topics, addReminder, deleteReminder, updateReminderInstance, addEvent } = useData();
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    name: '',
    description: '',
    topicId: '',
    triggerType: 'time' as 'time' | 'after-event',
    triggerTime: '09:00',
    triggerEventTopicId: '',
    triggerOffsetMinutes: 45,
    triggerLatestTime: '',
    repeatCount: 0,
    repeatIntervalMinutes: 60,
    isActive: true,
  });

  const pendingInstances = reminderInstances.filter(i => i.status === 'pending');
  const now = Date.now();
  const dueInstances = pendingInstances.filter(i => i.scheduledTime <= now);

  const handleAddReminder = async () => {
    if (!reminderForm.name) return;
    
    await addReminder({
      ...reminderForm,
      triggerTime: reminderForm.triggerType === 'time' ? reminderForm.triggerTime : undefined,
      triggerEventTopicId: reminderForm.triggerType === 'after-event' ? reminderForm.triggerEventTopicId : undefined,
      triggerOffsetMinutes: reminderForm.triggerType === 'after-event' ? reminderForm.triggerOffsetMinutes : undefined,
      triggerLatestTime: reminderForm.triggerLatestTime || undefined,
      repeatCount: reminderForm.repeatCount > 0 ? reminderForm.repeatCount : undefined,
      repeatIntervalMinutes: reminderForm.repeatCount > 0 ? reminderForm.repeatIntervalMinutes : undefined,
    });

    setReminderForm({
      name: '',
      description: '',
      topicId: '',
      triggerType: 'time',
      triggerTime: '09:00',
      triggerEventTopicId: '',
      triggerOffsetMinutes: 45,
      triggerLatestTime: '',
      repeatCount: 0,
      repeatIntervalMinutes: 60,
      isActive: true,
    });
    setShowNewReminder(false);
  };

  const handleDismiss = async (instanceId: string) => {
    await updateReminderInstance(instanceId, { status: 'dismissed' });
  };

  const handleSnooze = async (instanceId: string, minutes: number) => {
    const snoozedUntil = Date.now() + (minutes * 60 * 1000);
    await updateReminderInstance(instanceId, { 
      status: 'snoozed',
      snoozedUntil,
      scheduledTime: snoozedUntil 
    });
  };

  const handleComplete = async (instance: any) => {
    const reminder = reminders.find(r => r.id === instance.reminderId);
    if (!reminder) return;

    // If reminder has an associated topic, create event
    if (reminder.topicId) {
      const topic = topics.find(t => t.id === reminder.topicId);
      if (topic) {
        const eventId = await addEvent({
          topicId: topic.id,
          timestamp: Date.now(),
          axes: [],
          notes: `Completed from reminder: ${reminder.name}`,
        });
        
        await updateReminderInstance(instance.id, { 
          status: 'completed',
          completedEventId: eventId 
        });
      }
    } else {
      await updateReminderInstance(instance.id, { status: 'completed' });
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
        <button
          onClick={() => setShowNewReminder(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>

      {dueInstances.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            Due Now
          </h2>
          {dueInstances.map(instance => {
            const reminder = reminders.find(r => r.id === instance.reminderId);
            if (!reminder) return null;

            return (
              <div key={instance.id} className="card bg-red-50 border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{reminder.name}</h3>
                    {reminder.description && (
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {format(instance.scheduledTime, 'h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleComplete(instance)}
                    className="btn btn-primary flex-1 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1 inline" />
                    Complete
                  </button>
                  <button
                    onClick={() => handleSnooze(instance.id, 15)}
                    className="btn btn-secondary text-sm"
                  >
                    15m
                  </button>
                  <button
                    onClick={() => handleDismiss(instance.id)}
                    className="btn btn-secondary text-sm"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showNewReminder && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">New Reminder</h2>
          
          <input
            type="text"
            placeholder="Reminder name"
            value={reminderForm.name}
            onChange={(e) => setReminderForm({ ...reminderForm, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />

          <textarea
            placeholder="Description (optional)"
            value={reminderForm.description}
            onChange={(e) => setReminderForm({ ...reminderForm, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Associated Topic (optional)
            </label>
            <select
              value={reminderForm.topicId}
              onChange={(e) => setReminderForm({ ...reminderForm, topicId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">None</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.icon} {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Type</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="time"
                  checked={reminderForm.triggerType === 'time'}
                  onChange={() => setReminderForm({ ...reminderForm, triggerType: 'time' })}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>At a specific time</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="after-event"
                  checked={reminderForm.triggerType === 'after-event'}
                  onChange={() => setReminderForm({ ...reminderForm, triggerType: 'after-event' })}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>After an event</span>
              </label>
            </div>
          </div>

          {reminderForm.triggerType === 'time' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={reminderForm.triggerTime}
                onChange={(e) => setReminderForm({ ...reminderForm, triggerTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {reminderForm.triggerType === 'after-event' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">After Event</label>
                <select
                  value={reminderForm.triggerEventTopicId}
                  onChange={(e) => setReminderForm({ ...reminderForm, triggerEventTopicId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select event type</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.icon} {topic.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offset (minutes)
                </label>
                <input
                  type="number"
                  value={reminderForm.triggerOffsetMinutes}
                  onChange={(e) => setReminderForm({ ...reminderForm, triggerOffsetMinutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or by time (optional)
                </label>
                <input
                  type="time"
                  value={reminderForm.triggerLatestTime}
                  onChange={(e) => setReminderForm({ ...reminderForm, triggerLatestTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat Count (0 for no repeat)
            </label>
            <input
              type="number"
              min="0"
              value={reminderForm.repeatCount}
              onChange={(e) => setReminderForm({ ...reminderForm, repeatCount: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {reminderForm.repeatCount > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat Interval (minutes)
              </label>
              <input
                type="number"
                value={reminderForm.repeatIntervalMinutes}
                onChange={(e) => setReminderForm({ ...reminderForm, repeatIntervalMinutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleAddReminder} className="btn btn-primary flex-1">
              Save Reminder
            </button>
            <button onClick={() => setShowNewReminder(false)} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">All Reminders</h2>
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reminders yet. Add one to get started!
          </div>
        ) : (
          reminders.map(reminder => (
            <div key={reminder.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{reminder.name}</h3>
                  {reminder.description && (
                    <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {reminder.triggerType === 'time' && `Daily at ${reminder.triggerTime}`}
                    {reminder.triggerType === 'after-event' && (
                      <>
                        {reminder.triggerOffsetMinutes} min after{' '}
                        {topics.find(t => t.id === reminder.triggerEventTopicId)?.name}
                      </>
                    )}
                  </div>
                  {!reminder.isActive && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                      Inactive
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
