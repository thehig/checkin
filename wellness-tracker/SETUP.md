# Setup Instructions

## Quick Start (Demo Mode)

The app works immediately with local storage only - no setup required!

```bash
npm install
npm run dev
```

Visit http://localhost:3000 and start tracking.

## Full Setup (Cloud Sync + Auth)

### 1. Supabase Project Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database provisioning

### 2. Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Copy contents of `supabase-schema.sql`
3. Execute the SQL
4. Verify tables are created in Table Editor

### 3. Authentication Setup

#### Google OAuth

1. Go to Authentication > Providers in Supabase
2. Enable Google provider
3. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com):
   - Create project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

#### Apple OAuth

1. Enable Apple provider in Supabase
2. Set up [Apple Sign In](https://developer.apple.com/sign-in-with-apple/):
   - Create App ID
   - Create Service ID
   - Configure redirect URI
3. Copy credentials to Supabase

### 4. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in Supabase dashboard under Settings > API

### 5. Deploy

#### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

#### Other Platforms

Build the app:

```bash
npm run build
npm start
```

## PWA Setup

### Icons

Replace these files in `public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

Generate icons at [RealFaviconGenerator](https://realfavicongenerator.net/)

### Testing PWA

1. Build for production: `npm run build`
2. Serve: `npm start`
3. Use Lighthouse in Chrome DevTools
4. Check PWA criteria

## Troubleshooting

### Service Worker Not Registering

- Ensure you're on HTTPS or localhost
- Check browser console for errors
- Clear browser cache

### Supabase Connection Issues

- Verify environment variables
- Check Supabase project status
- Verify RLS policies are enabled

### OAuth Not Working

- Check redirect URIs match exactly
- Verify OAuth credentials
- Check provider settings in Supabase

### IndexedDB Errors

- Check browser supports IndexedDB
- Clear browser data
- Check for private browsing restrictions

## Development Tips

### Hot Reload

```bash
npm run dev
```

### Type Checking

```bash
npm run build
```

### Database Inspection

Use Dexie's built-in tools:

```javascript
import { db } from '@/lib/db';
db.topics.toArray().then(console.log);
```

### Supabase Local Development

```bash
npx supabase init
npx supabase start
```

## Production Checklist

- [ ] Icons generated (192x192, 512x512)
- [ ] Environment variables set
- [ ] OAuth providers configured
- [ ] RLS policies tested
- [ ] Service worker tested
- [ ] PWA installable on iOS/Android
- [ ] Offline mode works
- [ ] Sync tested
- [ ] Performance optimized (Lighthouse)
