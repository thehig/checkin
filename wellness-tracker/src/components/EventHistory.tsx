import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

export function EventHistory() {
  const { events, topics, axes } = useData();

  const getTopicById = (id: string) => topics.find(t => t.id === id);
  const getAxisById = (id: string) => axes.find(a => a.id === id);

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h2>
        <p className="text-gray-600">Start logging to see your history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Event History</h1>
      
      {events.map(event => {
        const topic = getTopicById(event.topicId);
        if (!topic) return null;

        return (
          <div key={event.id} className="card space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{topic.icon || '📝'}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {format(event.timestamp, 'MMM d, h:mm a')}
                  </div>
                </div>
              </div>
            </div>

            {event.axes.length > 0 && (
              <div className="space-y-2">
                {event.axes.map(eventAxis => {
                  const axis = getAxisById(eventAxis.axisId);
                  if (!axis) return null;

                  return (
                    <div key={eventAxis.axisId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {axis.icon} {axis.name}
                      </span>
                      <span className="font-semibold text-primary-600">
                        {eventAxis.value.toFixed(1)}/5.0
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {event.notes && (
              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-1">Notes</div>
                <p className="text-sm text-gray-600">{event.notes}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
