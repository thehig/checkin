'use client';

import { useState, useEffect } from 'react';
import { TopicSelector } from '@/components/topic-selector';
import { QuickEventForm } from '@/components/quick-event-form';
import { WellnessCheck } from '@/components/wellness-check';
import { useWellnessStore } from '@/lib/store';
import { db } from '@/lib/db';
import type { TopicWithAxes, Event, EventValue, Axis } from '@/lib/types';

export default function DataEntryPage() {
  const store = useWellnessStore();
  const topics = store.topics || [];
  const axes = store.axes || [];
  const addEvent = store.addEvent;
  
  const [selectedTopic, setSelectedTopic] = useState<TopicWithAxes | null>(null);
  const [showWellnessCheck, setShowWellnessCheck] = useState(false);
  const [pendingEventData, setPendingEventData] = useState<{
    values: Record<string, number>;
    notes?: string;
  } | null>(null);

  const handleTopicSelect = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
    }
  };

  const handleEventSubmit = async (
    values: Record<string, number>,
    notes?: string
  ) => {
    if (!selectedTopic) return;

    setPendingEventData({ values, notes });
    setShowWellnessCheck(true);
  };

  const handleWellnessComplete = async (wellnessValues: {
    mental: number;
    physical: number;
    emotional: number;
  }) => {
    await saveEvent(wellnessValues);
  };

  const handleWellnessSkip = async () => {
    await saveEvent();
  };

  const saveEvent = async (wellnessValues?: {
    mental: number;
    physical: number;
    emotional: number;
  }) => {
    if (!selectedTopic || !pendingEventData) return;

    try {
      const userId = 'demo-user'; // Replace with actual user ID from auth
      const now = new Date().toISOString();

      // Save main event
      const event: Event = {
        id: crypto.randomUUID(),
        user_id: userId,
        topic_id: selectedTopic.id,
        notes: pendingEventData.notes,
        occurred_at: now,
        created_at: now,
        updated_at: now,
      };

      await db.events.add(event);

      // Save event values
      for (const [axisId, value] of Object.entries(pendingEventData.values)) {
        const eventValue: EventValue = {
          id: crypto.randomUUID(),
          event_id: event.id,
          axis_id: axisId,
          value,
          created_at: now,
        };
        await db.eventValues.add(eventValue);
      }

      // Save wellness check if provided
      if (wellnessValues) {
        const wellnessEvent: Event = {
          id: crypto.randomUUID(),
          user_id: userId,
          topic_id: undefined, // Wellness check doesn't need a topic
          notes: 'Wellness check',
          occurred_at: now,
          created_at: now,
          updated_at: now,
        };

        await db.events.add(wellnessEvent);

        const defaultAxes = axes.filter((a) => a.is_default);
        const mentalAxis = defaultAxes.find((a) => a.name === 'Mental');
        const physicalAxis = defaultAxes.find((a) => a.name === 'Physical');
        const emotionalAxis = defaultAxes.find((a) => a.name === 'Emotional');

        if (mentalAxis) {
          await db.eventValues.add({
            id: crypto.randomUUID(),
            event_id: wellnessEvent.id,
            axis_id: mentalAxis.id,
            value: wellnessValues.mental,
            created_at: now,
          });
        }
        if (physicalAxis) {
          await db.eventValues.add({
            id: crypto.randomUUID(),
            event_id: wellnessEvent.id,
            axis_id: physicalAxis.id,
            value: wellnessValues.physical,
            created_at: now,
          });
        }
        if (emotionalAxis) {
          await db.eventValues.add({
            id: crypto.randomUUID(),
            event_id: wellnessEvent.id,
            axis_id: emotionalAxis.id,
            value: wellnessValues.emotional,
            created_at: now,
          });
        }
      }

      addEvent(event);
      
      // Reset state
      setSelectedTopic(null);
      setPendingEventData(null);
      setShowWellnessCheck(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const getTopicAxes = (topic: TopicWithAxes): Axis[] => {
    if (!topic.axes) return [];
    return topic.axes
      .map((ta) => axes.find((a) => a.id === ta.axis_id))
      .filter((a): a is Axis => a !== undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Day
          </h1>
          <p className="text-gray-600">Quick and easy wellness logging</p>
        </div>

        {!selectedTopic && !showWellnessCheck && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <TopicSelector
              topics={topics}
              onSelect={handleTopicSelect}
            />
          </div>
        )}

        {selectedTopic && !showWellnessCheck && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <QuickEventForm
              topicName={selectedTopic.name}
              topicIcon={selectedTopic.icon}
              axes={getTopicAxes(selectedTopic).map((a) => ({
                id: a.id,
                name: a.name,
                icon: a.icon,
              }))}
              onSubmit={handleEventSubmit}
              onCancel={() => setSelectedTopic(null)}
            />
          </div>
        )}

        {showWellnessCheck && (
          <WellnessCheck
            onComplete={handleWellnessComplete}
            onSkip={handleWellnessSkip}
          />
        )}
      </div>
    </div>
  );
}
