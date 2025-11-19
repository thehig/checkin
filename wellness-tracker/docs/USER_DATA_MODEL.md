# Per-User Topics and Axes

## Data Model

### Predefined (Common to All Users)
- **Wellness Check Topic** with 3 axes:
  - Mental (🧠)
  - Physical (💪)
  - Emotional (❤️)

### User-Created
- All other topics and axes are created by individual users
- Each user's topics/axes are private to them
- Users can create unlimited custom topics with their own axes

## Database Structure

### Topics Table
```sql
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  display_order INTEGER DEFAULT 0,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);
```

**Note:** The Wellness Check topic should be created for each user when they first sign up or sync.

### Axes Table
```sql
CREATE TABLE axes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  min_label TEXT,
  max_label TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);
```

## User Experience

### First-Time User
1. Opens app (offline/local mode)
2. Sees only "Wellness Check" topic
3. Can create their own custom topics via "Manage" tab
4. Each topic can have custom axes they define

### Signed-In User
1. Wellness Check syncs across devices
2. Custom topics/axes sync across devices
3. Each user's data is isolated via RLS policies
4. No shared topics except Wellness Check

## Creating Custom Topics

Users can create topics for anything they want to track:
- **Medications**: with axes like "Taken on time", "Side effects"
- **Sleep**: with axes like "Quality", "Duration", "Restfulness"
- **Meals**: with axes like "Protein", "Fiber", "Satisfaction"
- **Exercise**: with axes like "Intensity", "Duration", "Enjoyment"
- **Mood**: with axes like "Anxiety", "Depression", "Energy"
- **Pain**: with axes like "Severity", "Location", "Duration"

## Implementation Details

### Local Initialization
- Only Wellness Check + 3 axes created in IndexedDB
- User must manually create any other topics they want

### Cloud Sync
- On first sync, Wellness Check is pushed to cloud
- User's custom topics/axes sync normally
- Each user has their own isolated dataset

### Migration from Multi-Topic Default
If upgrading from a version that had default topics (Wake Up, Medication):
1. These will remain for existing users
2. New users only get Wellness Check
3. Users can delete unwanted default topics via Manage tab

## Benefits

✅ **Personalization**: Each user creates exactly what they need  
✅ **Privacy**: No shared data between users  
✅ **Flexibility**: Users can track any aspect of their life  
✅ **Simplicity**: New users start with minimal setup  
✅ **Consistency**: Wellness Check is universal for comparison

