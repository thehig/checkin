'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { useWellnessStore } from '@/lib/store';
import type { Axis, Topic, TopicAxis } from '@/lib/types';

export function DataInitializer({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const { setTopics, setAxes } = useWellnessStore();

  useEffect(() => {
    const initializeData = async () => {
      const existingAxes = await db.axes.count();
      const existingTopics = await db.topics.count();

      // Only seed if database is empty
      if (existingAxes === 0 && existingTopics === 0) {
        await seedDefaultData();
      }

      // Load data into store
      const axes = await db.axes.toArray();
      const topics = await db.topics.toArray();
      const topicAxes = await db.topicAxes.toArray();

      const topicsWithAxes = topics.map((topic) => ({
        ...topic,
        axes: topicAxes
          .filter((ta) => ta.topic_id === topic.id)
          .map((ta) => ({
            ...ta,
            axis: axes.find((a) => a.id === ta.axis_id)!,
          })),
      }));

      setAxes(axes);
      setTopics(topicsWithAxes);
      setInitialized(true);
    };

    initializeData();
  }, [setAxes, setTopics]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

async function seedDefaultData() {
  const userId = 'demo-user'; // Replace with actual user ID
  const now = new Date().toISOString();

  // Create default axes
  const mentalAxis: Axis = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Mental',
    icon: '🧠',
    description: 'Mental clarity and focus',
    min_value: 0,
    max_value: 5,
    is_default: true,
    created_at: now,
    updated_at: now,
  };

  const physicalAxis: Axis = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Physical',
    icon: '💪',
    description: 'Physical energy and health',
    min_value: 0,
    max_value: 5,
    is_default: true,
    created_at: now,
    updated_at: now,
  };

  const emotionalAxis: Axis = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Emotional',
    icon: '❤️',
    description: 'Emotional wellbeing',
    min_value: 0,
    max_value: 5,
    is_default: true,
    created_at: now,
    updated_at: now,
  };

  const proteinAxis: Axis = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Protein',
    icon: '🥩',
    description: 'Protein intake level',
    min_value: 0,
    max_value: 5,
    is_default: false,
    created_at: now,
    updated_at: now,
  };

  const fiberAxis: Axis = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Fiber',
    icon: '🥬',
    description: 'Fiber intake level',
    min_value: 0,
    max_value: 5,
    is_default: false,
    created_at: now,
    updated_at: now,
  };

  await db.axes.bulkAdd([
    mentalAxis,
    physicalAxis,
    emotionalAxis,
    proteinAxis,
    fiberAxis,
  ]);

  // Create default topics
  const wakeUpTopic: Topic = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Wake Up',
    icon: '☀️',
    color: '#FCD34D',
    description: 'Morning wake up time',
    is_wellness_check: false,
    created_at: now,
    updated_at: now,
  };

  const breakfastTopic: Topic = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Breakfast',
    icon: '🍳',
    color: '#FB923C',
    description: 'Morning meal',
    is_wellness_check: false,
    created_at: now,
    updated_at: now,
  };

  const medicationTopic: Topic = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Medication',
    icon: '💊',
    color: '#F472B6',
    description: 'Take medication',
    is_wellness_check: false,
    created_at: now,
    updated_at: now,
  };

  const bathroomTopic: Topic = {
    id: crypto.randomUUID(),
    user_id: userId,
    name: 'Bathroom',
    icon: '🚽',
    color: '#60A5FA',
    description: 'Bathroom event',
    is_wellness_check: false,
    created_at: now,
    updated_at: now,
  };

  await db.topics.bulkAdd([
    wakeUpTopic,
    breakfastTopic,
    medicationTopic,
    bathroomTopic,
  ]);

  // Link axes to topics
  const topicAxes: TopicAxis[] = [
    // Wake Up has no specific axes
    // Breakfast has Protein and Fiber
    {
      id: crypto.randomUUID(),
      topic_id: breakfastTopic.id,
      axis_id: proteinAxis.id,
      order_index: 0,
      created_at: now,
    },
    {
      id: crypto.randomUUID(),
      topic_id: breakfastTopic.id,
      axis_id: fiberAxis.id,
      order_index: 1,
      created_at: now,
    },
    // Medication has no specific axes (just logging)
  ];

  await db.topicAxes.bulkAdd(topicAxes);
}
