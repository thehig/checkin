# Supabase Setup Guide

This guide will help you set up Supabase for cloud sync and authentication in the Wellness Tracker app.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `wellness-tracker` (or your preferred name)
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Select the region closest to you
4. Click "Create new project" and wait for it to initialize (takes 1-2 minutes)

## 2. Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear) in the sidebar
2. Go to **API** section
3. You'll need two values:
   - **Project URL**: Found under "Project URL" (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **anon public key**: Found under "Project API keys" → "anon public"

## 3. Set Up Environment Variables

1. In the `wellness-tracker` directory, create a `.env` file
2. Add your credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Example:**

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

3. **NEVER commit the `.env` file to version control!** It's already in `.gitignore`.

## 4. Run the Database Schema

1. In your Supabase project dashboard, click on the **SQL Editor** icon in the sidebar
2. Click "New Query"
3. Copy the entire contents of `docs/schema.sql` and paste it into the editor
4. Click "Run" to execute the schema
5. You should see a success message

## 5. Configure OAuth Providers

### Google OAuth

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Find "Google" and click to expand
3. Enable Google provider
4. Follow the instructions to create OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret into Supabase
6. Save the configuration

### Apple OAuth

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Find "Apple" and click to expand
3. Enable Apple provider
4. Follow the instructions to create Apple Sign In credentials:
   - Go to [Apple Developer](https://developer.apple.com/)
   - Create a Services ID
   - Configure Sign in with Apple
   - Add redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`
5. Copy the Service ID, Team ID, and Key ID into Supabase
6. Upload your private key file
7. Save the configuration

### Email/Password (Already Enabled)

Email/Password authentication is enabled by default in Supabase. You can configure:

- Email confirmation requirements
- Password requirements
- Email templates

Go to **Authentication** → **Settings** to customize these options.

## 6. Configure Email Templates (Optional)

Customize the emails sent for:

- Email confirmation
- Password reset
- Magic link sign in

Go to **Authentication** → **Email Templates** to edit the templates.

## 7. Test Your Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open the app and click "Sign In"
3. Try creating an account with email/password
4. Check your email for confirmation
5. Try signing in with Google or Apple (if configured)

## 8. Row Level Security (RLS) Policies

The schema includes RLS policies that ensure users can only access their own data. These are automatically applied when you run the schema.

Key policies:

- Users can only view/edit/delete their own data
- All tables are protected with `user_id` filters
- Anonymous access is disabled

## Troubleshooting

### "Supabase Not Configured" Error

- Make sure `.env` file exists with correct credentials
- Restart the dev server after creating `.env`
- Check that URLs don't have trailing slashes

### OAuth Redirect Errors

- Verify redirect URLs match exactly in provider settings
- Check that provider is enabled in Supabase dashboard
- Clear browser cache and try again

### Sync Not Working

- Check browser console for errors
- Verify RLS policies are applied (run schema again if needed)
- Check that user is authenticated before syncing

### Email Not Sending

- Verify email settings in Supabase dashboard
- Check spam folder
- For production, configure a custom SMTP server

## Production Deployment

For production deployment:

1. **Add environment variables** to your hosting platform (Vercel, Netlify, etc.)
2. **Update OAuth redirect URLs** to include your production domain
3. **Configure custom SMTP** for reliable email delivery (optional but recommended)
4. **Enable rate limiting** in Supabase dashboard to prevent abuse
5. **Monitor usage** in Supabase dashboard to stay within free tier limits

## Supabase Free Tier Limits

- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth per month
- 50,000 monthly active users
- Unlimited API requests

For most personal use cases, the free tier is sufficient. Monitor usage in the Supabase dashboard.

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Project README](../README.md)
