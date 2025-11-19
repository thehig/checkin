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
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'home'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Log</span>
          </button>

          <button
            onClick={() => setCurrentView('history')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'history'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>

          <button
            onClick={() => setCurrentView('reminders')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'reminders'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs font-medium">Reminders</span>
          </button>

          <button
            onClick={() => setCurrentView('manage')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'manage'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Manage</span>
          </button>

          <button
            onClick={() => user ? setCurrentView('profile') : setShowSignIn(true)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors relative ${
              currentView === 'profile'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {user ? <User className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
            <span className="text-xs font-medium">{user ? 'Profile' : 'Sign In'}</span>
            {user && syncStatus === 'synced' && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
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
