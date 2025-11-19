# Deployment Guide

Deploy your Wellness Tracker to production.

## Quick Deploy to Vercel (5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps

1. **Push to GitHub**

```bash
cd wellness-tracker
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/wellness-tracker.git
git push -u origin main
```

2. **Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow prompts:
- Link to GitHub repo? Yes
- Which scope? (Select your account)
- Link to existing project? No
- Project name? wellness-tracker
- Directory? ./
- Override settings? No

3. **Add Environment Variables (Optional)**

If using Supabase:
- Go to Vercel dashboard
- Select your project
- Settings → Environment Variables
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Done!**

Your app is live at `https://wellness-tracker-xxx.vercel.app`

### Custom Domain (Optional)

1. Go to Vercel project settings
2. Domains → Add
3. Follow DNS setup instructions

## Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

## Alternative: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t wellness-tracker .
docker run -p 3000:3000 wellness-tracker
```

## Alternative: Self-Hosted

### Requirements
- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)

### Setup

1. **Install PM2**

```bash
npm install -g pm2
```

2. **Build and Start**

```bash
npm run build
pm2 start npm --name "wellness-tracker" -- start
pm2 save
pm2 startup
```

3. **Configure Nginx**

```nginx
server {
    listen 80;
    server_name wellness.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable HTTPS (Required for PWA)**

```bash
sudo certbot --nginx -d wellness.yourdomain.com
```

## Post-Deployment Checklist

### Essential
- [ ] App loads correctly
- [ ] Environment variables set (if using Supabase)
- [ ] HTTPS enabled (required for PWA)
- [ ] Service worker registers
- [ ] PWA installable on iOS/Android

### Performance
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Cache headers configured
- [ ] Compression enabled

### Security
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] No exposed secrets
- [ ] Rate limiting (if needed)

### PWA
- [ ] manifest.json accessible
- [ ] Icons load correctly
- [ ] Service worker active
- [ ] Offline mode works
- [ ] Install prompt shows

## Monitoring

### Vercel Analytics

Enable in project settings:
- Analytics → Enable
- View real-time usage data

### Sentry Error Tracking

```bash
npm install @sentry/nextjs

# Follow setup wizard
npx @sentry/wizard -i nextjs
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

## Scaling

### Database
- Upgrade Supabase plan if needed
- Enable connection pooling
- Add read replicas

### CDN
- Vercel includes CDN
- Or use Cloudflare

### Caching
- Enable Next.js cache
- Use Redis for sessions
- CDN for static assets

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### Service Worker Issues
- Check HTTPS is enabled
- Verify manifest.json loads
- Check browser console

### Environment Variables
- Ensure `NEXT_PUBLIC_` prefix
- Restart after changes
- Check Vercel logs

### Performance Issues
- Enable Next.js caching
- Optimize images
- Enable compression
- Use CDN

## Rollback

### Vercel
- Go to Deployments
- Find previous deployment
- Click "Promote to Production"

### Docker
```bash
docker ps  # Find container
docker stop <container-id>
docker run <previous-image>
```

## Backup

### Database
```bash
# Supabase backup
supabase db dump > backup.sql

# Restore
psql -h db.xxx.supabase.co -U postgres < backup.sql
```

### IndexedDB
Users' local data is stored in browser.
No server-side backup needed for local-only mode.

## Cost Estimates

### Free Tier
- **Vercel**: Free (hobby plan)
- **Supabase**: Free (500MB database, 50k monthly active users)
- **Total**: $0/month

### Paid Tier (if needed)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Total**: $45/month

## Support

### Vercel Support
- Dashboard help
- Community Discord
- Documentation

### Self-Hosted Support
- Check logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- Application logs: Check console

---

**Ready to share your wellness tracker with the world! 🚀**
