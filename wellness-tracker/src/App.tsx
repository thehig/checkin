import { useState } from 'react';
import { DataProvider } from './contexts/DataContext';
import { QuickEntry } from './components/QuickEntry';
import { EventHistory } from './components/EventHistory';
import { ManageTopics } from './components/ManageTopics';
import { Reminders } from './components/Reminders';
import { Home, Clock, Settings, Bell } from 'lucide-react';

type View = 'home' | 'history' | 'manage' | 'reminders';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

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
      default:
        return <QuickEntry />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-2xl mx-auto p-4">
          {renderView()}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
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
          </div>
        </nav>
      </div>
    </DataProvider>
  );
}

export default App;
