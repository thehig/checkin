'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickEventFormProps {
  topicName: string;
  topicIcon?: string;
  axes: Array<{ id: string; name: string; icon?: string }>;
  onSubmit: (values: Record<string, number>, notes?: string) => void;
  onCancel: () => void;
}

export function QuickEventForm({
  topicName,
  topicIcon,
  axes,
  onSubmit,
  onCancel,
}: QuickEventFormProps) {
  const [values, setValues] = useState<Record<string, number>>(
    axes.reduce((acc, axis) => ({ ...acc, [axis.id]: 2.5 }), {})
  );
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values, notes || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {topicIcon && <span className="text-3xl">{topicIcon}</span>}
          <h2 className="text-xl font-semibold text-gray-900">{topicName}</h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {axes.map((axis) => (
          <div key={axis.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {axis.icon && <span className="text-xl">{axis.icon}</span>}
                <span className="font-medium text-gray-700">{axis.name}</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 min-w-[3rem] text-right">
                {values[axis.id]?.toFixed(1) ?? '0.0'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={values[axis.id] ?? 2.5}
              onChange={(e) =>
                setValues({ ...values, [axis.id]: parseFloat(e.target.value) })
              }
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>5</span>
            </div>
          </div>
        ))}
      </div>

      {!showNotes ? (
        <button
          type="button"
          onClick={() => setShowNotes(true)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add notes
        </button>
      ) : (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          rows={3}
        />
      )}

      <button
        type="submit"
        className="w-full px-4 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg text-lg"
      >
        Save Event
      </button>
    </form>
  );
}
