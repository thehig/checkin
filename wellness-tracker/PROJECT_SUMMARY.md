# Wellness Tracker - Project Summary

## Overview

A mobile-first Progressive Web App (PWA) designed for tracking wellness metrics with customizable topics and measurement scales. Built specifically for users with ADHD and mild autism who need quick, intuitive event logging and smart reminders.

## ✅ Completed Features

### Core Functionality
- ✅ Quick event logging interface
- ✅ Custom topics (Wake Up, Breakfast, Medications, Bathroom, etc.)
- ✅ Custom axes/scales (Mental, Physical, Emotional, Protein, Fiber, etc.)
- ✅ Wellness check-ins with emoji feedback
- ✅ Event history with filtering
- ✅ Offline-first architecture with IndexedDB
- ✅ PWA support with service worker
- ✅ Mobile/tablet responsive design
- ✅ OAuth authentication setup (Google/Apple)

### Technical Implementation
- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ TailwindCSS for styling
- ✅ Zustand for state management
- ✅ Dexie (IndexedDB) for local storage
- ✅ Supabase integration for cloud sync
- ✅ Complete database schema with RLS policies
- ✅ Seed data for quick start

### UI/UX
- ✅ Clean, uncluttered interface
- ✅ Emoji-based visual feedback
- ✅ Slider controls (0.0 - 5.0 with 0.5 increments)
- ✅ Topic selector grid
- ✅ Bottom navigation
- ✅ Loading states
- ✅ Empty states

## 🚧 Pending Features (Future Work)

### Smart Reminders
- ⏳ Event-based triggers (e.g., "45 min after wake up")
- ⏳ Time-based triggers (e.g., "9:30 AM")
- ⏳ Repeating reminders with intervals
- ⏳ Snooze/dismiss functionality
- ⏳ Push notifications

### Data Visualization
- ⏳ Charts and graphs
- ⏳ Trend analysis
- ⏳ Correlation insights

### Export/Import
- ⏳ CSV export
- ⏳ Excel export
- ⏳ Google Sheets integration
- ⏳ Data backup/restore

### Advanced Features
- ⏳ Multi-user support
- ⏳ Data sharing with caregivers
- ⏳ Voice input
- ⏳ Dark mode
- ⏳ Accessibility enhancements

## Project Structure

```
wellness-tracker/
├── app/                          # Next.js pages
│   ├── page.tsx                 # Data entry (home)
│   ├── history/page.tsx         # Event history
│   ├── settings/page.tsx        # Manage topics/axes
│   ├── reminders/page.tsx       # Reminders (placeholder)
│   ├── login/page.tsx           # OAuth login
│   ├── auth/callback/route.ts   # OAuth callback
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── axis-slider.tsx          # Slider with emoji
│   ├── topic-selector.tsx       # Topic grid
│   ├── quick-event-form.tsx     # Event logging form
│   ├── wellness-check.tsx       # Wellness check-in
│   ├── navigation.tsx           # Bottom nav
│   ├── data-initializer.tsx     # Seed data loader
│   ├── pwa-installer.tsx        # Service worker register
│   └── ui/slider.tsx            # Base slider component
├── lib/
│   ├── types.ts                 # TypeScript definitions
│   ├── db.ts                    # Dexie database
│   ├── store.ts                 # Zustand store
│   ├── utils.ts                 # Utility functions
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client
│   └── hooks/
│       └── useAuth.ts          # Auth hook
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   ├── icon-192.svg            # App icon (small)
│   └── icon-512.svg            # App icon (large)
├── supabase-schema.sql         # Database schema
├── README.md                   # Main documentation
├── SETUP.md                    # Setup instructions
└── package.json                # Dependencies
```

## Key Technologies

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| TailwindCSS | Utility-first styling |
| Zustand | Lightweight state management |
| Dexie | IndexedDB wrapper for offline storage |
| Supabase | Backend-as-a-Service (auth, database, sync) |
| Radix UI | Accessible component primitives |
| Lucide React | Icon library |
| date-fns | Date manipulation |

## Database Schema

### Core Tables
- **profiles**: User accounts
- **axes**: Measurement scales (e.g., Mental, Physical)
- **topics**: Event categories (e.g., Breakfast, Medications)
- **topic_axes**: Many-to-many relationship
- **events**: Logged event instances
- **event_values**: Actual measurements for events
- **reminders**: Reminder rules
- **scheduled_reminders**: Active reminder instances

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies enforce data isolation

## User Flow

### First-Time Setup
1. User opens app
2. Prompted to log in (or skip for demo)
3. Default topics and axes are seeded
4. Redirect to data entry page

### Daily Usage
1. Open app (from home screen if installed as PWA)
2. Select topic from grid
3. Adjust sliders for each axis
4. Optionally add notes
5. Save event
6. Optionally complete wellness check
7. View history or manage settings

### Managing Topics
1. Navigate to Settings
2. Switch to Topics tab
3. Add/edit/delete topics
4. Assign axes to topics
5. Customize icons and colors

## Setup Requirements

### Minimal (Local Only)
- Node.js 18+
- No external services required
- Works immediately with IndexedDB

### Full (Cloud Sync + Auth)
- Supabase project
- OAuth credentials (Google/Apple)
- Environment variables configured
- Database schema applied

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### PWA Icons
Replace `public/icon-192.svg` and `public/icon-512.svg` with custom icons.

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Other Platforms
```bash
npm run build
npm start
```

Ensure environment variables are set in deployment platform.

## Testing

### Manual Testing
1. Test offline mode (disable network)
2. Test PWA installation
3. Test data entry flow
4. Test settings management
5. Test history viewing

### Browser Compatibility
- Chrome/Edge (recommended)
- Safari (iOS support)
- Firefox
- Modern browsers with Service Worker support

## Performance

- Lighthouse Score Target: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Offline support: Full
- Bundle size: Optimized with Next.js

## Security Considerations

- All user data encrypted at rest (Supabase)
- HTTPS required for PWA
- OAuth for authentication
- RLS policies prevent data leaks
- Client-side validation
- Server-side validation on Supabase

## Known Limitations

1. Reminder system not yet implemented
2. No data visualization
3. No export functionality
4. Single-user focus (no collaboration)
5. Limited notification support

## Future Enhancements

### Phase 2 (Reminders)
- Implement reminder scheduling
- Add push notifications
- Event-based triggers
- Repeating patterns

### Phase 3 (Analytics)
- Data visualization
- Trend analysis
- Insights and recommendations

### Phase 4 (Social)
- Multi-user support
- Caregiver sharing
- Community features

## Support

For issues or questions:
1. Check README.md
2. Check SETUP.md
3. Review code comments
4. Submit GitHub issue

## License

MIT License - Free to use and modify

---

**Built with ❤️ for wellness tracking**
