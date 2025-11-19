# Wellness Tracker - Developer Guide

A Progressive Web App (PWA) for tracking personal wellness metrics across custom topics and axes.

---

## 🏗️ Tech Stack

### **Frontend**
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **date-fns** - Date formatting utilities

### **State Management**
- **React Context API** - Global state
  - `DataContext` - Manages topics, axes, events, reminders
  - `AuthContext` - User authentication state
  - `NotificationContext` - Toast notifications

### **Local Storage**
- **IndexedDB** - Browser-native database
- **Dexie.js** - IndexedDB wrapper library
- **Database**: `WellnessTrackerDB` (schema version 3)

### **Backend/Cloud**
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication (Google, Apple, Email/Password)
  - Row Level Security (RLS) policies
  - Real-time sync capabilities

### **PWA Features**
- **Service Worker** - Offline caching (`public/sw.js`)
- **Web App Manifest** - Installation metadata (`public/manifest.json`)
- **Push Notifications** - (Future: reminder alerts)

### **Deployment**
- **Vercel** - Hosting and CI/CD
- **Git** - Version control

---

## 📁 Project Structure

```
wellness-tracker/
├── public/
│   ├── sw.js              # Service worker for PWA
│   ├── manifest.json      # PWA manifest
│   └── icon.svg           # App icon
├── src/
│   ├── components/        # React components
│   │   ├── QuickEntry.tsx       # Main logging interface
│   │   ├── EventHistory.tsx     # Event list view
│   │   ├── ManageTopics.tsx     # Topic/Axis management
│   │   ├── Reminders.tsx        # Reminder setup
│   │   ├── SignIn.tsx           # Auth modal
│   │   └── Profile.tsx          # User profile/sync status
│   ├── contexts/          # React contexts
│   │   ├── DataContext.tsx      # Data management + sync
│   │   ├── AuthContext.tsx      # Authentication
│   │   └── NotificationContext.tsx  # Toasts
│   ├── database.ts        # Dexie/IndexedDB schema
│   ├── supabase.ts        # Supabase client + helpers
│   ├── types.ts           # TypeScript interfaces
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── docs/                  # Documentation
│   ├── schema.sql         # Supabase database schema
│   ├── SUPABASE_SETUP.md  # Supabase configuration guide
│   ├── AUTH_IMPLEMENTATION.md  # Auth architecture
│   └── USER_DATA_MODEL.md # Data model explanation
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Supabase account (for cloud sync)
- Vercel account (for deployment)

### **Local Development**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🗄️ Database Schema

### **Local (IndexedDB via Dexie)**

Current version: **3**

**Tables:**
- `topics` - User-defined categories to track
- `axes` - Measurement scales (belong to topics)
- `events` - Logged data points
- `reminders` - Scheduled notifications
- `reminderInstances` - Individual reminder occurrences
- `users` - User profile data (minimal)
- `settings` - User preferences

### **Cloud (Supabase PostgreSQL)**

Mirror of local schema with snake_case naming:
- `topics`
- `axes`
- `events`
- `reminders`
- `reminder_instances`

**Key Features:**
- All tables have `user_id` foreign key
- Row Level Security (RLS) enforces data isolation
- Automatic `created_at` and `updated_at` timestamps

**Schema file:** `docs/schema.sql`

---

## 🔐 Authentication

### **Providers Supported:**
- Google OAuth
- Apple OAuth
- Email/Password

### **Flow:**
1. User signs in via `SignIn.tsx` component
2. Supabase handles OAuth/auth
3. `AuthContext` stores user session
4. Local data remains local until first sync
5. On sync, data is uploaded with `user_id`

### **Offline Mode:**
- App works fully offline without authentication
- Data stored only in local IndexedDB
- User can sign in later to enable cloud sync

---

## 🔄 Data Sync

### **Sync Strategy:**
- **Bidirectional:** Local ↔ Cloud
- **Conflict Resolution:** Last-write-wins (by `updated_at` timestamp)
- **Trigger:** Manual (sync button) or automatic (on auth state change)

### **Data Transformation:**
- **Local:** camelCase (e.g., `createdAt`)
- **Cloud:** snake_case (e.g., `created_at`)
- Transformers: `toSnakeCase()` and `toCamelCase()` in `supabase.ts`

### **Sync Status Indicator:**
- 🟢 Green dot = Synced
- 🟡 Yellow dot = Syncing/Offline
- 🔴 Red dot = Error

---

## 🎨 UI/UX Considerations

### **ADHD-Friendly Design:**
- ✅ Minimal distractions (removed success toasts for routine actions)
- ✅ Clean, uncluttered interface
- ✅ Quick entry workflow (2-3 taps to log)
- ✅ Visual feedback via status dots (not popups)
- ✅ Drag-and-drop reordering (intuitive)

### **Mobile-First:**
- Optimized for iOS/Android
- Touch-friendly controls
- Bottom navigation (thumb-friendly)
- PWA installable to home screen

---

## 📦 Deployment

### **Vercel (Production)**

1. **First-time setup:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Deploy updates:**
   ```bash
   vercel --prod
   ```

3. **Environment Variables:**
   Set in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Deployment Protection:**
   Make sure it's **DISABLED** in Settings → Deployment Protection
   (Otherwise users need Vercel login to access)

### **Production URLs:**
- Main: `https://wellness-tracker-[hash].vercel.app`
- Custom domain: (optional, configure in Vercel dashboard)

---

## 🛠️ Common Tasks

### **Add a New Topic Field:**
1. Update `Topic` interface in `src/types.ts`
2. Update Dexie schema in `src/database.ts` (increment version)
3. Add migration in `.upgrade()` handler
4. Update Supabase schema in `docs/schema.sql`
5. Run SQL migration in Supabase dashboard
6. Update `toSnakeCase`/`toCamelCase` if needed

### **Add a New Component:**
1. Create in `src/components/[ComponentName].tsx`
2. Import in `App.tsx`
3. Add to navigation if needed
4. Use contexts via `useData()`, `useAuth()`, `useNotification()`

### **Update Service Worker:**
1. Edit `public/sw.js`
2. Increment `CACHE_VERSION`
3. Deploy (users get update on next refresh)

### **Change App Icon:**
1. Replace `public/icon.svg`
2. Update `public/manifest.json` if needed
3. Deploy

### **Debug Sync Issues:**
1. Check browser console for errors
2. Verify Supabase RLS policies allow user access
3. Check data transformations (camelCase ↔ snake_case)
4. Inspect IndexedDB via browser DevTools
5. Check Supabase logs in dashboard

---

## 🧪 Testing

### **Local Testing:**
```bash
npm run dev
```

### **PWA Testing:**
1. Build: `npm run build`
2. Preview: `npm run preview`
3. Test service worker in browser DevTools
4. Test "Add to Home Screen" on mobile

### **Database Testing:**
- Open browser DevTools → Application → IndexedDB
- View `WellnessTrackerDB` tables
- Check Supabase dashboard for cloud data

---

## 🐛 Troubleshooting

### **"No topics showing"**
- Clear IndexedDB: DevTools → Application → IndexedDB → Delete `WellnessTrackerDB`
- Refresh page (will reinitialize with Wellness Check)

### **"Sync failed"**
- Check Supabase env vars are set
- Verify user is authenticated
- Check network tab for API errors
- Verify RLS policies in Supabase

### **"Service worker not registering"**
- Requires HTTPS in production (Vercel provides this)
- Check `sw.js` for syntax errors
- Clear site data and refresh

### **"TypeScript errors on build"**
- Run `npm run build` locally first
- Check `tsconfig.json` settings
- Verify all imports use correct casing

---

## 📚 External Services

### **Supabase**
- **Purpose:** Cloud database + authentication
- **Dashboard:** https://app.supabase.com
- **Setup Guide:** `docs/SUPABASE_SETUP.md`
- **Cost:** Free tier (50k rows, 500MB storage)

### **Vercel**
- **Purpose:** Hosting + CI/CD
- **Dashboard:** https://vercel.com/dashboard
- **Cost:** Free tier (100GB bandwidth)

### **OAuth Providers**
- **Google:** Configure in Supabase dashboard
- **Apple:** Configure in Supabase dashboard
- **Setup:** Requires client IDs/secrets

---

## 📖 Key Concepts

### **Topic**
- A category the user wants to track (e.g., "Medication", "Sleep")
- Has multiple axes for measurement
- Only **Wellness Check** is predefined; users create the rest

### **Axis**
- A measurement scale (0-5) belonging to a topic
- E.g., "Mental" axis for Wellness Check
- Has custom labels (min/max) like "Worst"/"Best"

### **Event**
- A logged data point for a topic
- Contains axis values + optional notes + timestamp
- Stored locally and synced to cloud

### **Reminder**
- Scheduled notification for a topic
- Can trigger after events or at specific times
- Can repeat multiple times

---

## 🔮 Future Enhancements

- [ ] Data visualization/graphs
- [ ] Export to CSV/Google Sheets
- [ ] Push notifications for reminders
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Sharing/collaboration features

---

## 📝 Notes

- **Data Privacy:** Each user's data is isolated via RLS policies
- **Offline-First:** App fully functional without internet
- **Progressive:** Features degrade gracefully (no auth = local-only)
- **Accessible:** Keyboard navigation, screen reader friendly

---

## 🤝 Contributing

This is a personal project, but if you want to extend it:

1. Fork the repo
2. Create a feature branch
3. Make changes
4. Test locally
5. Submit pull request

---

## 📄 License

Private/Personal Use

---

## 🆘 Support

If something breaks:
1. Check browser console for errors
2. Review this README
3. Check `docs/` folder for detailed guides
4. Clear IndexedDB and refresh
5. Redeploy to Vercel

---

**Last Updated:** November 2024

