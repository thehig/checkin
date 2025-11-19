# Quick Start Guide

Get your Wellness Tracker running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
cd wellness-tracker
npm install
```

## Step 2: Run the App (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 3: Try It Out (2 min)

### Log Your First Event

1. **Select a Topic**: Click on "Wake Up" or "Breakfast"
2. **Adjust Sliders**: Move sliders to rate your experience
3. **Save**: Click "Save Event"
4. **Wellness Check**: Fill in Mental/Physical/Emotional (or skip)

### View Your History

1. Click "History" in bottom navigation
2. See all logged events with values

### Create Custom Topics

1. Click "Settings" in bottom navigation
2. Click "Add Topic"
3. Fill in:
   - Name: "Morning Coffee"
   - Icon: ☕
   - Color: #8B4513
4. Click "Save"

### Create Custom Scales

1. Stay in Settings
2. Switch to "Scales" tab
3. Click "Add Scale"
4. Fill in:
   - Name: "Caffeine Level"
   - Icon: ⚡
5. Click "Save"

## What's Pre-Loaded?

The app comes with sample data:

### Default Topics
- ☀️ Wake Up
- 🍳 Breakfast (with Protein and Fiber scales)
- 💊 Medication
- 🚽 Bathroom

### Default Scales
- 🧠 Mental (default wellness scale)
- 💪 Physical (default wellness scale)
- ❤️ Emotional (default wellness scale)
- 🥩 Protein
- 🥬 Fiber

## Features You Can Use Now

✅ **Quick Event Logging**: < 10 seconds per entry
✅ **Offline Mode**: Works without internet
✅ **Custom Topics**: Unlimited custom categories
✅ **Custom Scales**: Track anything from 0-5
✅ **History**: View all past events
✅ **Wellness Checks**: Optional check-ins
✅ **Notes**: Add context to any event

## Optional: Install as PWA

### On iPhone/iPad
1. Open in Safari
2. Tap share button
3. "Add to Home Screen"
4. Tap "Add"

### On Android
1. Open in Chrome
2. Tap menu (⋮)
3. "Install app"

## Optional: Enable Cloud Sync

See `SETUP.md` for Supabase configuration.

## Tips for Best Experience

### For Quick Logging
- Pre-create all topics you use regularly
- Use emojis for visual recognition
- Keep axes simple (2-3 per topic)

### For ADHD-Friendly Use
- Pin app to home screen
- Enable notifications (coming soon)
- Keep interface clean (hide unused topics)

### For Data Tracking
- Log consistently at same times
- Add notes for unusual events
- Review history weekly

## Keyboard Shortcuts

- **Escape**: Cancel/close current view
- **Enter**: Save current form
- **Tab**: Navigate between fields

## Troubleshooting

### App won't load?
- Check console for errors (F12)
- Clear browser cache
- Try incognito mode

### Data not saving?
- Check IndexedDB is enabled
- Disable private browsing
- Check storage quota

### PWA won't install?
- Must use HTTPS (or localhost)
- Service worker must register
- Check manifest.json is accessible

## Next Steps

1. **Customize Topics**: Add your daily activities
2. **Set Up Reminders**: Coming soon!
3. **Enable Cloud Sync**: See SETUP.md
4. **Install on Device**: Use as native app

## Example Daily Flow

### Morning
1. Open app → Select "Wake Up" → Save
2. Wellness check → Rate mood/energy
3. Select "Breakfast" → Rate protein/fiber → Save
4. Select "Medication" → Save

### Throughout Day
- Log events as they happen
- Add notes for unusual situations
- Check history when needed

### Evening
- Review daily history
- Note patterns
- Plan for tomorrow

## Need Help?

- Check `README.md` for full docs
- Check `SETUP.md` for advanced config
- Check `PROJECT_SUMMARY.md` for architecture

---

**Happy tracking! 🎉**
