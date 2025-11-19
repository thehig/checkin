# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended for beginners)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/wellness-tracker.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite and configure build settings
   - Click "Deploy"

3. **Add Environment Variables (Optional - for Supabase)**
   - In Vercel project settings, go to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy with Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Or use Netlify UI**
   - Drag and drop the `dist` folder to [netlify.com/drop](https://netlify.com/drop)

### Option 3: GitHub Pages

1. **Update `vite.config.ts`**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/wellness-tracker/', // Replace with your repo name
   })
   ```

2. **Build and deploy**
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

### Option 4: Self-hosted (any server)

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Upload `dist` folder contents to your web server**
   - Apache: Upload to `/var/www/html/`
   - Nginx: Upload to `/usr/share/nginx/html/`

3. **Configure server for SPA**
   
   **Nginx:**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```
   
   **Apache (.htaccess):**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Supabase Setup (Optional - for Cloud Sync)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for database to provision

2. **Run SQL Schema**
   - Open SQL Editor in Supabase dashboard
   - Copy contents of `docs/schema.sql`
   - Run the SQL

3. **Get API Keys**
   - Go to Settings → API
   - Copy:
     - Project URL
     - Anon/Public key

4. **Configure Environment Variables**
   - Create `.env` file (or add to Vercel/Netlify)
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Enable OAuth Providers (Optional)**
   - Go to Authentication → Providers
   - Enable Google and/or Apple
   - Configure OAuth credentials

## PWA Installation

### iOS (Safari)

1. Open the deployed app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. App now works like a native app!

### Android (Chrome)

1. Open the deployed app in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

### Desktop (Chrome/Edge)

1. Visit the app URL
2. Look for install icon in address bar
3. Click "Install"

## Push Notifications Setup

For notifications to work on iOS/Android:

1. **Service Worker must be served over HTTPS**
   - All deployment options above provide HTTPS
   - Local development: notifications won't work on `localhost`

2. **User must grant permission**
   - App will request permission on first launch
   - User can manage in browser/OS settings

3. **For scheduled reminders**
   - App must be kept in background
   - Or use a backend service (advanced)

## Troubleshooting

### Build fails
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` again

### App doesn't install as PWA
- Verify you're using HTTPS
- Check browser console for service worker errors
- Ensure `manifest.json` and `sw.js` are accessible

### Supabase sync not working
- Verify environment variables are set correctly
- Check browser console for errors
- Verify SQL schema is applied
- Check RLS policies are enabled

### Notifications not working
- Only work on HTTPS (not localhost)
- User must grant permission
- Some browsers (Safari) have limited support
- Check browser compatibility

## Performance Tips

1. **Enable caching**
   - Service worker handles offline caching
   - Configure CDN caching headers

2. **Image optimization**
   - Icons are SVG (already optimal)
   - If adding photos, use WebP format

3. **Database optimization**
   - IndexedDB handles local storage efficiently
   - For large datasets, implement pagination

## Monitoring

- **Vercel**: Built-in analytics
- **Netlify**: Analytics available in dashboard
- **Self-hosted**: Use Google Analytics or Plausible

## Updates

To update the deployed app:

1. Make changes to code
2. `npm run build`
3. Deploy using same method as initial deployment
4. Service worker will update automatically for users
