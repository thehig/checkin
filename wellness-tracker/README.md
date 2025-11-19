# Wellness Tracker

A Progressive Web App (PWA) designed to help track wellness metrics across multiple axes with smart reminders and event-based tracking. Built specifically for individuals with ADHD and autism, featuring a clean, uncluttered interface with minimal cognitive load.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)

## ✨ Key Features

- **Quick Data Entry**: Rapidly log events with customizable topics and axes
- **Wellness Tracking**: Monitor Mental, Physical, and Emotional states (0-5 scale with decimal precision)
- **Custom Topics & Axes**: Create your own tracking categories (medications, meals, activities, etc.)
- **Smart Reminders**: Set time-based or event-triggered reminders
  - Example: "Take meds 45 minutes after waking up, or by 9:30am"
  - Chain reminders (e.g., "3 hours after taking meds, take next dose")
- **PWA Support**: Install on iOS/Android as a native-like app
- **Offline-First**: All data stored locally with optional cloud sync
- **Cloud Sync**: Optional Supabase integration for multi-device sync
- **Push Notifications**: Receive reminder notifications on your device

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Local Storage**: IndexedDB (via Dexie.js)
- **Cloud Sync**: Supabase (optional)
- **PWA**: Service Workers, Web App Manifest
- **Build Tool**: Vite

## 🚀 Quick Start

```bash
# Clone or download this repository
cd wellness-tracker

# Run setup script (installs dependencies and builds)
./setup.sh

# Or manually:
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 📱 Screenshots

*PWA running on iOS showing quick entry interface*

## 📚 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy to various platforms
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical overview and architecture

## Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Optional: Supabase Setup

For cloud sync functionality:

1. Create a Supabase project at https://supabase.com
2. Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. Set up database tables (SQL schema in `/docs/schema.sql`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to deploy to any static hosting service.

## Usage Guide

### Quick Start

1. **Open the app** - You'll see the quick entry screen
2. **Select a topic** - Choose from preset topics or create your own
3. **Rate on axes** - Use sliders to rate different aspects (0.0-5.0)
4. **Add wellness check** - Optionally track Mental/Physical/Emotional state
5. **Save** - Event is logged with timestamp

### Creating Custom Topics

1. Navigate to **Manage** tab
2. Click **Add Topic**
3. Configure:
   - Name and icon
   - Associated axes (select which metrics to track)
   - Whether to include wellness check
4. Save

### Creating Custom Axes

1. Navigate to **Manage** tab
2. Scroll to **Manage Axes**
3. Click **Add Axis**
4. Configure:
   - Name and icon
   - Min/Max labels (e.g., "Low/High", "Bad/Good")
5. Save

### Setting Up Reminders

1. Navigate to **Reminders** tab
2. Click **Add**
3. Configure trigger:
   - **Time-based**: "Every day at 9:00 AM"
   - **Event-based**: "45 minutes after Wake Up event"
4. Optionally set repeats
5. Save

### Example Workflows

**Morning Routine:**
1. Log "Wake Up" event (7:00 AM)
2. App reminds you to take medication (7:45 AM)
3. After confirming medication, app schedules next dose reminder
4. Log wellness check throughout the day

**Meal Tracking:**
1. Create "Breakfast" topic with axes: Protein, Fiber, Satisfaction
2. After eating, quickly log meal with slider ratings
3. View history to spot patterns

## Device Support

- **iOS**: Install as PWA from Safari (Share → Add to Home Screen)
- **Android**: Install prompt appears automatically
- **Desktop**: Works in any modern browser

## Privacy

- All data stored locally by default
- Cloud sync is completely optional
- No tracking or analytics
- Open source

## Development

### Project Structure

```
src/
├── components/       # React components
├── contexts/         # React contexts (data management)
├── types.ts          # TypeScript type definitions
├── database.ts       # IndexedDB setup (Dexie)
├── supabase.ts       # Supabase client (optional)
└── App.tsx           # Main app component
```

### Key Components

- `QuickEntry.tsx` - Main data entry interface
- `EventHistory.tsx` - View past events
- `ManageTopics.tsx` - Create/edit topics and axes
- `Reminders.tsx` - Manage reminders

## Future Enhancements

- Data visualization and charts
- Export to CSV/Excel/Google Sheets
- Pattern recognition and insights
- Customizable themes
- Multi-language support

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
