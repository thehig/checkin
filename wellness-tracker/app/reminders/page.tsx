'use client';

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reminders</h1>
          <p className="text-gray-600">Manage your smart reminders</p>
        </div>

        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">Reminder system coming soon</p>
          <p className="text-sm text-gray-400 mt-2">
            Smart reminders based on events and time
          </p>
        </div>
      </div>
    </div>
  );
}
