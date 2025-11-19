# Wellness Tracker - User Guide

## Getting Started

### First Time Setup

1. **Open the app** - Navigate to the app URL or tap the icon if installed
2. **Review default topics** - The app comes with 3 starter topics:
   - Wake Up
   - Take Medication
   - Wellness Check
3. **Start logging!** - Tap any topic to log your first event

## Core Concepts

### Topics
**Topics** are things you want to track. Examples:
- Wake Up
- Take Medication
- Breakfast
- Exercise
- Headache
- Mood Check

Each topic can have:
- Name and icon (emoji)
- Custom axes for rating
- Optional wellness check
- Associated reminders

### Axes
**Axes** are scales you use to rate things (0.0 - 5.0). Examples:
- Mental: How clear-headed you feel
- Physical: Energy level
- Emotional: Mood state
- Protein: How much protein in meal
- Pain: Level of discomfort

Each axis has:
- Name and icon
- Min/Max labels (e.g., "Low"/"High", "Bad"/"Good")

### Events
**Events** are logged instances of topics with timestamps. Each event includes:
- Which topic
- Ratings on relevant axes
- Optional wellness check (Mental/Physical/Emotional)
- Optional notes
- Automatic timestamp

### Reminders
**Reminders** help you remember to log events. Two types:

1. **Time-based**: "Every day at 9:00 AM"
2. **Event-based**: "45 minutes after Wake Up"

Reminders can also:
- Have a "or by" time limit
- Repeat multiple times
- Spawn follow-up reminders

## Daily Workflow

### Morning Routine Example

1. **Wake Up** (7:00 AM)
   - Tap "Wake Up" topic
   - Add wellness check
   - Save

2. **Take Medication** (7:45 AM)
   - Reminder appears automatically
   - Tap notification
   - Complete the log
   - Next reminder auto-scheduled

3. **Breakfast** (8:30 AM)
   - Tap "Breakfast" topic
   - Rate Protein, Fiber, etc.
   - Save

4. **Throughout the day**
   - Log events as they happen
   - Respond to reminders
   - Add notes when needed

## Features Guide

### Quick Logging

The app is designed for **speed**:

1. Open app → Immediately see topics
2. Tap topic → See relevant axes
3. Slide to rate → Takes 2-3 seconds
4. Save → Done!

**Tips:**
- Most used topics should be at top
- Pre-fill common values (default: 3.0)
- Notes are optional - only add when relevant

### Creating Custom Topics

1. Go to **Manage** tab
2. Tap **Add Topic**
3. Enter:
   - Name (e.g., "Lunch")
   - Icon (any emoji: 🍱)
   - Description (optional)
   - Select axes to track
   - Include wellness check? (optional)
4. Save

**Example Topics:**
- 🍱 Meals (axes: Protein, Fiber, Satisfaction)
- 🚽 Bathroom (axes: Ease, Straining, Cleanup)
- 💊 Medication (no axes, just log it happened)
- 🎮 Activity (axes: Enjoyment, Energy, Focus)
- 😴 Sleep (axes: Duration, Quality, Dreams)

### Creating Custom Axes

1. Go to **Manage** tab
2. Scroll to **Manage Axes**
3. Tap **Add Axis**
4. Enter:
   - Name (e.g., "Pain Level")
   - Icon (emoji: 🤕)
   - Min label ("None")
   - Max label ("Severe")
5. Save

**Example Axes:**
- 🤕 Pain: None → Severe
- 💧 Hydration: Dehydrated → Hydrated
- 😊 Happiness: Sad → Happy
- ⚡ Energy: Exhausted → Energized
- 🎯 Focus: Scattered → Locked In

### Setting Up Reminders

#### Time-based Reminder

1. Go to **Reminders** tab
2. Tap **Add**
3. Enter name: "Morning Medication"
4. Select trigger type: "At a specific time"
5. Set time: 9:00 AM
6. Optionally associate with topic
7. Save

#### Event-based Reminder

1. Go to **Reminders** tab
2. Tap **Add**
3. Enter name: "Take ADHD Meds"
4. Select trigger type: "After an event"
5. After event: "Wake Up"
6. Offset: 45 minutes
7. Or by time: 9:30 AM (optional)
8. Save

#### Repeating Reminder

1. Create any reminder (above steps)
2. Set "Repeat Count": 3
3. Set "Repeat Interval": 60 minutes
4. Save

**Result:** After first dose, schedules 3 more doses, 1 hour apart

### Working with Reminders

When a reminder fires:

1. **Notification appears** (if granted permission)
2. **Options:**
   - **Complete**: Logs event and marks done
   - **Snooze 15m**: Delays reminder
   - **Dismiss**: Closes without logging

**Tips:**
- Snooze if you're busy
- Complete if you've taken action
- Dismiss only if reminder is wrong/not needed

### Viewing History

1. Go to **History** tab
2. See all logged events
3. Most recent at top
4. Each shows:
   - Topic and icon
   - Timestamp
   - Axis ratings
   - Wellness check (if included)
   - Notes

**Use cases:**
- Track patterns over time
- Show doctor/therapist
- Remember when you last did something
- Spot correlations

## Tips for Success

### For ADHD Users

1. **Keep topics simple**
   - Don't create too many at once
   - Start with 5-7 most important
   - Add more gradually

2. **Use visual cues**
   - Choose distinct emojis
   - Use colors to categorize
   - Keep names short

3. **Leverage reminders**
   - Set up morning routine chain
   - Use event-based for flexible schedule
   - Set "or by" times for hard deadlines

4. **Reduce friction**
   - Install as PWA on home screen
   - Enable notifications
   - Log immediately (don't delay)

### For Wellness Tracking

1. **Log wellness checks regularly**
   - Morning check-in
   - Mid-day check-in
   - Evening check-in

2. **Be honest with ratings**
   - 5 = Best possible
   - 3 = Average/Neutral
   - 1 = Worst
   - Use 0.5 increments for precision

3. **Add notes for context**
   - Why was energy low?
   - What made mood good?
   - Any unusual circumstances?

### Privacy & Data

1. **Local-first**
   - All data stored on device
   - Works completely offline
   - No tracking or analytics

2. **Cloud sync (optional)**
   - Only if you set up Supabase
   - End-to-end between your devices
   - You control the database

3. **Backup data**
   - Export feature (coming soon)
   - Or back up Supabase database
   - Browser data can be lost if cleared

## Troubleshooting

### App won't load
- Check internet connection
- Clear browser cache
- Try hard refresh (Ctrl+Shift+R)

### Reminders not showing
- Check notification permissions
- Verify reminder is active
- Ensure app is installed as PWA

### Data disappeared
- Check if browser data was cleared
- If using cloud sync, try re-syncing
- Always keep backups

### Can't install as PWA
- Must use HTTPS (not http://)
- Try different browser
- Some browsers don't support PWA

## Keyboard Shortcuts

*Coming soon!*

## Export Data

*Feature coming soon - will support:*
- CSV export
- JSON export
- Google Sheets integration
- Excel format

## Advanced Features

### Pattern Recognition
*Coming soon - AI-powered insights:*
- Correlation between events
- Predict low energy days
- Suggest optimal timing
- Identify triggers

### Data Visualization
*Coming soon:*
- Line charts for trends
- Heatmaps for patterns
- Compare axes over time
- Weekly/monthly summaries

## Support

- **Issues**: Open a GitHub issue
- **Questions**: Check README.md
- **Feature requests**: Submit PR or issue

## Privacy Policy

This app:
- ✅ Stores data locally on your device
- ✅ Optional cloud sync (you control)
- ❌ No tracking or analytics
- ❌ No third-party data sharing
- ❌ No advertisements

Your wellness data is **yours**.
