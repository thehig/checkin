# Wellness Tracker

A Progressive Web App (PWA) for tracking wellness metrics, managing custom trackable events, and setting smart reminders.

## Features

- **Custom Topics & Axes**: Create personalized topics (e.g., Breakfast, Medications) and axes (e.g., Mental, Physical, Emotional) to track
- **Quick Data Entry**: Fast, mobile-optimized interface for logging events with slider-based value input (0.0-5.0)
- **Smart Reminders**: Time-based or event-triggered reminders with repeat functionality
- **Wellness Checks**: Built-in wellness tracking on Mental, Physical, and Emotional axes
- **History View**: Review past entries with visual indicators
- **PWA Support**: Install on iOS/Android devices for a native app experience
- **Offline-First**: Local database with cloud sync via Supabase
- **OAuth Authentication**: Sign in with Google or Apple

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: 
  - Local: Dexie (IndexedDB)
  - Cloud: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with OAuth
- **PWA**: next-pwa

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema in `supabase/schema.sql` in the Supabase SQL Editor
   - Configure OAuth providers (Google, Apple) in Supabase Auth settings

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The app uses the following main tables:
- `axes`: User-defined measurement scales
- `topics`: Trackable items/events
- `topic_axes`: Relationship between topics and their axes
- `events`: Logged occurrences
- `event_values`: Axis values for each event
- `reminders`: Reminder configurations
- `scheduled_reminders`: Scheduled reminder instances

See `supabase/schema.sql` for full schema details.

## Project Structure

```
/app
  /auth           - Authentication pages
  /dashboard      - Main app interface
    /entry        - Data entry pages
    /history      - Event history
    /settings     - Topic/axis management
    /reminders    - Reminder configuration
/lib
  /db             - Local database (Dexie)
  /services       - Data services
  /supabase       - Supabase clients
  /types          - TypeScript types
/public           - Static assets & PWA manifest
```

## Usage Example

### Creating a Topic

1. Go to Settings
2. Click "Add New Topic"
3. Enter name, icon, and select axes
4. Save

### Logging an Event

1. From dashboard, tap a topic card
2. Adjust sliders for each axis (0.0-5.0)
3. Optionally add notes
4. Save entry

### Setting a Reminder

1. Go to Settings → Reminders
2. Click "Add New Reminder"
3. Configure trigger (time or event-based)
4. Set repeat options if needed
5. Save

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## PWA Installation

### iOS
1. Open the app in Safari
2. Tap the share button
3. Select "Add to Home Screen"

### Android
1. Open the app in Chrome
2. Tap the menu
3. Select "Install App" or "Add to Home Screen"

## Contributing

Contributions welcome! Please open an issue or PR.

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.
