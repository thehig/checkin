# Wellness Tracker - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Go to Project Settings → API
   - Copy Project URL and anon/public key
   - Update `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Set Up Database**
   - In Supabase Dashboard, go to SQL Editor
   - Create new query
   - Copy contents of `supabase/schema.sql`
   - Run the query to create tables and policies

4. **Configure OAuth (Optional but Recommended)**
   
   **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - In Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add Client ID and Secret
   
   **Apple OAuth:**
   - Go to [Apple Developer](https://developer.apple.com)
   - Create Services ID
   - Configure Sign in with Apple
   - In Supabase Dashboard → Authentication → Providers
   - Enable Apple provider
   - Add Service ID, Team ID, and Key ID

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Production Deployment

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Push code to GitHub
   - Import project in Vercel
   - Add environment variables
   - Deploy

## PWA Icons

Replace placeholder icons in `/public`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

Use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) to create properly sized icons.

## Testing

1. Sign up with Google/Apple
2. Create default topics (auto-created on first load)
3. Add custom topics in Settings
4. Log events from dashboard
5. Set up reminders
6. Check history

## Troubleshooting

**Auth not working:**
- Check OAuth credentials
- Verify redirect URIs match
- Check browser console for errors

**Data not syncing:**
- Verify Supabase credentials
- Check RLS policies are enabled
- Check network tab for API errors

**PWA not installing:**
- Use HTTPS (required for PWA)
- Check manifest.json is accessible
- Verify icons exist

## Next Steps

- Add real PWA icons
- Customize colors in `tailwind.config.ts`
- Add data visualization/charts
- Implement data export (CSV/Excel)
- Add recurring time-based reminders
