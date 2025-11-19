# Wellness Tracker

A Progressive Web App (PWA) for tracking wellness events with customizable topics and scales. Built for mobile-first usage with offline support.

## Features

- **Quick Event Logging**: Fast, intuitive interface for logging wellness events
- **Custom Topics**: Create and manage your own tracking categories (Breakfast, Medications, etc.)
- **Custom Axes/Scales**: Define measurement scales (0-5) for any metric
- **Wellness Check-ins**: Track Mental, Physical, and Emotional states
- **Smart Reminders**: Schedule reminders based on events or fixed times (coming soon)
- **PWA Support**: Install on iOS/Android as a native-like app
- **Offline Support**: Works without internet using IndexedDB
- **Cloud Sync**: Sync with Supabase when online (requires setup)
- **OAuth Login**: Sign in with Google or Apple (requires setup)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS
- **State**: Zustand
- **Database**: 
  - Local: Dexie (IndexedDB wrapper)
  - Cloud: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with OAuth providers
- **PWA**: Service Workers, Web App Manifest

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional, for cloud features)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. (Optional) Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql`
   - Add your Supabase URL and anon key to `.env.local`
   - Configure OAuth providers in Supabase dashboard

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Data Entry

1. Open the app
2. Select a topic (Wake Up, Breakfast, Medications, etc.)
3. Adjust sliders for each axis/scale
4. Optionally add notes
5. Save event
6. Optionally complete wellness check-in

### Managing Topics and Axes

1. Navigate to Settings
2. Switch between Topics and Scales tabs
3. Add, edit, or delete custom topics and scales
4. Topics can have multiple associated scales

### Example Use Cases

**Morning Routine**:
- Log "Wake Up" event
- Complete wellness check (Mental: 2/5, Physical: 1/5, Emotional: 4/5)
- Log "Medication" event 45 minutes later
- Log "Breakfast" with Protein and Fiber ratings

**Custom Tracking**:
- Create topic "Headache"
- Add axes: Intensity, Duration, Location
- Log events throughout the day

## Database Schema

### Core Tables

- `profiles`: User profiles
- `axes`: Measurement scales (0-5)
- `topics`: Event categories
- `topic_axes`: Many-to-many relationship
- `events`: Logged occurrences
- `event_values`: Axis values for each event
- `reminders`: Scheduled reminder rules
- `scheduled_reminders`: Active reminder instances

## PWA Installation

### iOS

1. Open app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android

1. Open app in Chrome
2. Tap menu (three dots)
3. Select "Install app" or "Add to Home Screen"

## Development

### Project Structure

```
wellness-tracker/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Data entry (home)
│   ├── history/           # Event history
│   ├── reminders/         # Reminders management
│   ├── settings/          # Topics/axes management
│   ├── login/             # Authentication
│   └── auth/callback/     # OAuth callback
├── components/            # React components
│   ├── axis-slider.tsx    # Slider with emoji feedback
│   ├── topic-selector.tsx # Topic picker grid
│   ├── quick-event-form.tsx
│   ├── wellness-check.tsx
│   └── ui/                # Base UI components
├── lib/
│   ├── db.ts              # Dexie (IndexedDB) setup
│   ├── store.ts           # Zustand state management
│   ├── types.ts           # TypeScript types
│   └── supabase/          # Supabase clients
└── public/
    ├── manifest.json      # PWA manifest
    └── sw.js              # Service worker
```

### Adding a New Feature

1. Define types in `lib/types.ts`
2. Update database schema if needed
3. Create UI components in `components/`
4. Add page in `app/` directory
5. Update navigation if needed

## Roadmap

- [ ] Smart reminder system with event-based triggers
- [ ] Push notifications
- [ ] Data visualization and charts
- [ ] Export data (CSV, Excel, Google Sheets)
- [ ] Multi-user support with sharing
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] Voice input for quick logging

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
