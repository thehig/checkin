import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, LogOut, Cloud, CloudOff, Loader2 } from 'lucide-react';

interface ProfileProps {
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncTime?: number;
  onSyncNow?: () => void;
}

export function Profile({ syncStatus, lastSyncTime, onSyncNow }: ProfileProps) {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  const getSyncStatusDisplay = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: <Cloud className="w-5 h-5 text-green-600" />,
          text: 'Synced',
          color: 'text-green-600',
        };
      case 'syncing':
        return {
          icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
          text: 'Syncing...',
          color: 'text-blue-600',
        };
      case 'offline':
        return {
          icon: <CloudOff className="w-5 h-5 text-gray-400" />,
          text: 'Offline',
          color: 'text-gray-400',
        };
      case 'error':
        return {
          icon: <Cloud className="w-5 h-5 text-red-600" />,
          text: 'Sync Error',
          color: 'text-red-600',
        };
    }
  };

  const syncDisplay = getSyncStatusDisplay();

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

  if (!user) return null;

  return (
    <div className="space-y-6 pb-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {syncDisplay.icon}
              <span className={`text-sm font-medium ${syncDisplay.color}`}>
                {syncDisplay.text}
              </span>
            </div>
            {onSyncNow && syncStatus !== 'syncing' && (
              <button
                onClick={onSyncNow}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Sync Now
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Last synced: {formatLastSync(lastSyncTime)}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full mt-4 btn btn-secondary flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing out...
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              Sign Out
            </>
          )}
        </button>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-2">About Cloud Sync</h3>
        <p className="text-sm text-gray-600 mb-3">
          Your data is automatically synced to the cloud when you're online. All data is stored locally and remains accessible even when offline.
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ Data synced across all your devices</li>
          <li>✓ Works offline with local storage</li>
          <li>✓ Automatic conflict resolution</li>
        </ul>
      </div>

      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-2">Account Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium text-gray-900">
              {user.app_metadata?.provider || 'email'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Account Created:</span>
            <span className="font-medium text-gray-900">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

