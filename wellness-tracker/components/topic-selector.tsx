'use client';

import { TopicWithAxes } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TopicSelectorProps {
  topics: TopicWithAxes[];
  selectedTopicId?: string;
  onSelect: (topicId: string) => void;
}

export function TopicSelector({ topics, selectedTopicId, onSelect }: TopicSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Select Activity</label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
              'hover:shadow-md active:scale-95',
              selectedTopicId === topic.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            )}
          >
            {topic.icon && (
              <span className="text-3xl" role="img" aria-label={topic.name}>
                {topic.icon}
              </span>
            )}
            <span className="text-sm font-medium text-center text-gray-900">
              {topic.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
