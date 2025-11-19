import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { QuickEntry } from './components/QuickEntry';
import { EventHistory } from './components/EventHistory';
import { ManageTopics } from './components/ManageTopics';
import { Reminders } from './components/Reminders';
import { Profile } from './components/Profile';
import { SignIn } from './components/SignIn';
import { Home, Clock, Settings, Bell, User, LogIn } from 'lucide-react';

type View = 'home' | 'history' | 'manage' | 'reminders' | 'profile';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useAuth();
  const { syncStatus, lastSyncTime, syncNow, enableAutoSync, disableAutoSync } = useData();

  // Enable auto-sync when user signs in
  useEffect(() => {
    if (user) {
      enableAutoSync(user.id);
      setShowSignIn(false);
    } else {
      disableAutoSync();
    }
  }, [user]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <QuickEntry />;
      case 'history':
        return <EventHistory />;
      case 'manage':
        return <ManageTopics />;
      case 'reminders':
        return <Reminders />;
      case 'profile':
        return user ? (
          <Profile 
            syncStatus={syncStatus}
            lastSyncTime={lastSyncTime}
            onSyncNow={user ? () => syncNow(user.id) : undefined}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sign in to view profile</h2>
            <button onClick={() => setShowSignIn(true)} className="btn btn-primary">
              Sign In
            </button>
          </div>
        );
      default:
        return <QuickEntry />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom z-40">
        <div className="max-w-2xl mx-auto flex justify-around items-center">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors focus-outline min-w-[44px] min-h-[44px] ${
              currentView === 'home'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Log new event"
            aria-current={currentView === 'home' ? 'page' : undefined}
          >
            <Home className="w-6 h-6" />
            <span className="text-sm font-medium">Log</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors focus-outline min-w-[44px] min-h-[44px] ${
              currentView === 'history'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="View event history"
            aria-current={currentView === 'history' ? 'page' : undefined}
          >
            <Clock className="w-6 h-6" />
            <span className="text-sm font-medium">History</span>
          </button>

          <button
            onClick={() => setCurrentView('reminders')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors focus-outline min-w-[44px] min-h-[44px] ${
              currentView === 'reminders'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Manage reminders"
            aria-current={currentView === 'reminders' ? 'page' : undefined}
          >
            <Bell className="w-6 h-6" />
            <span className="text-sm font-medium">Reminders</span>
          </button>

          <button
            onClick={() => setCurrentView('manage')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors focus-outline min-w-[44px] min-h-[44px] ${
              currentView === 'manage'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="Manage topics and axes"
            aria-current={currentView === 'manage' ? 'page' : undefined}
          >
            <Settings className="w-6 h-6" />
            <span className="text-sm font-medium">Manage</span>
          </button>

          <button
            onClick={() => user ? setCurrentView('profile') : setShowSignIn(true)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative focus-outline min-w-[44px] min-h-[44px] ${
              currentView === 'profile'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label={user ? 'View profile' : 'Sign in to sync data'}
            aria-current={currentView === 'profile' ? 'page' : undefined}
          >
            {user ? <User className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
            <span className="text-sm font-medium">{user ? 'Profile' : 'Sign In'}</span>
            {user && syncStatus === 'synced' && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" aria-label="Synced"></div>
            )}
          </button>
        </div>
      </nav>

      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
