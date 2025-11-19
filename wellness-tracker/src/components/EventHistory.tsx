import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import { Clock, RefreshCw, Cloud, CloudOff, CheckCircle, AlertCircle } from 'lucide-react';

export function EventHistory() {
  const { user } = useAuth();
  const { events, topics, axes, syncStatus, lastSyncTime, syncNow } = useData();
  const [syncing, setSyncing] = useState(false);

  const getTopicById = (id: string) => topics.find(t => t.id === id);
  const getAxisById = (id: string) => axes.find(a => a.id === id);

  const handleSync = async () => {
    if (!user) return;
    setSyncing(true);
    await syncNow(user.id);
    setSyncing(false);
  };

  const getSyncStatusIcon = () => {
    if (syncing || syncStatus === 'syncing') {
      return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
    }
    switch (syncStatus) {
      case 'synced':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'offline':
        return <CloudOff className="w-5 h-5 text-gray-400" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatLastSync = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (events.length === 0) {
    return (
      <div className="space-y-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Event History</h1>
          {user && (
            <button
              onClick={handleSync}
              disabled={syncing || syncStatus === 'syncing'}
              className="btn btn-primary flex items-center gap-2 text-sm"
            >
              {getSyncStatusIcon()}
              Sync
            </button>
          )}
        </div>

        {user && (
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSyncStatusIcon()}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {syncStatus === 'synced' && 'All synced'}
                    {syncStatus === 'syncing' && 'Syncing...'}
                    {syncStatus === 'offline' && 'Offline'}
                    {syncStatus === 'error' && 'Sync error'}
                  </p>
                  <p className="text-xs text-gray-600">
                    Last synced: {formatLastSync(lastSyncTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h2>
          <p className="text-gray-600">Start logging to see your history here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Event History</h1>
        {user && (
          <button
            onClick={handleSync}
            disabled={syncing || syncStatus === 'syncing'}
            className="btn btn-primary flex items-center gap-2 text-sm"
          >
            {getSyncStatusIcon()}
            Sync
          </button>
        )}
      </div>

      {user && (
        <div className={`card ${
          syncStatus === 'synced' ? 'bg-green-50 border-green-200' :
          syncStatus === 'error' ? 'bg-red-50 border-red-200' :
          syncStatus === 'offline' ? 'bg-gray-50 border-gray-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getSyncStatusIcon()}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {syncStatus === 'synced' && 'All synced'}
                  {syncStatus === 'syncing' && 'Syncing...'}
                  {syncStatus === 'offline' && 'Offline'}
                  {syncStatus === 'error' && 'Sync error'}
                </p>
                <p className="text-xs text-gray-600">
                  Last synced: {formatLastSync(lastSyncTime)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
