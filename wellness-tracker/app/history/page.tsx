'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { Event, EventValue, Topic, Axis } from '@/lib/types';
import { format } from 'date-fns';

interface EventWithDetails extends Event {
  topic?: Topic;
  values: Array<EventValue & { axis?: Axis }>;
}

export default function HistoryPage() {
  const [events, setEvents] = useState<EventWithDetails[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const allEvents = await db.events.reverse().sortBy('occurred_at');
    const topics = await db.topics.toArray();
    const axes = await db.axes.toArray();

    const eventsWithDetails = await Promise.all(
      allEvents.slice(0, 50).map(async (event) => {
        const eventValues = await db.eventValues.where('event_id').equals(event.id).toArray();
        
        return {
          ...event,
          topic: topics.find((t) => t.id === event.topic_id),
          values: eventValues.map((ev) => ({
            ...ev,
            axis: axes.find((a) => a.id === ev.axis_id),
          })),
        };
      })
    );

    setEvents(eventsWithDetails);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">History</h1>
          <p className="text-gray-600">Your recent wellness events</p>
        </div>

        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No events recorded yet</p>
              <p className="text-sm text-gray-400 mt-2">Start tracking to see your history</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {event.topic?.icon && (
                      <span className="text-2xl">{event.topic.icon}</span>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {event.topic?.name || 'Wellness Check'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(event.occurred_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>

                {event.values.length > 0 && (
                  <div className="space-y-2">
                    {event.values.map((value) => (
                      <div key={value.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {value.axis?.icon && (
                            <span className="text-lg">{value.axis.icon}</span>
                          )}
                          <span className="text-gray-700">{value.axis?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(value.value / 5) * 100}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900 min-w-[2.5rem] text-right">
                            {value.value.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {event.notes && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-600 italic">{event.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
