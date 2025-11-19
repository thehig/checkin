-- Create tables for the wellness tracker

-- Users table (Supabase handles auth, but we can extend user data)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Axes table (user-defined scales like Mental, Physical, Emotional)
CREATE TABLE axes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topics table (user-defined trackable items)
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_wellness_check BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topic-Axis relationships (which axes are used for which topics)
CREATE TABLE topic_axes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics ON DELETE CASCADE NOT NULL,
  axis_id UUID REFERENCES axes ON DELETE CASCADE NOT NULL,
  is_required BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_id, axis_id)
);

-- Events table (logged occurrences)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  topic_id UUID REFERENCES topics NOT NULL,
  notes TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event values (axis values for each event)
CREATE TABLE event_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events ON DELETE CASCADE NOT NULL,
  axis_id UUID REFERENCES axes NOT NULL,
  value DECIMAL(3,1) CHECK (value >= 0 AND value <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  topic_id UUID REFERENCES topics NOT NULL,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL, -- 'time' or 'event'
  trigger_time TIME, -- for time-based reminders
  trigger_event_topic_id UUID REFERENCES topics, -- for event-based reminders
  trigger_offset_minutes INTEGER, -- offset from trigger event
  max_time TIME, -- maximum time for reminder (e.g., "by 9:30am")
  repeat_count INTEGER DEFAULT 0,
  repeat_interval_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled reminders (instances that need to fire)
CREATE TABLE scheduled_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  reminder_id UUID REFERENCES reminders ON DELETE CASCADE NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'snoozed', 'completed', 'dismissed'
  snoozed_until TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  event_id UUID REFERENCES events, -- if resolved with an event
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_axes_user_id ON axes(user_id);
CREATE INDEX idx_topics_user_id ON topics(user_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_topic_id ON events(topic_id);
CREATE INDEX idx_events_occurred_at ON events(occurred_at);
CREATE INDEX idx_event_values_event_id ON event_values(event_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_scheduled_reminders_user_id ON scheduled_reminders(user_id);
CREATE INDEX idx_scheduled_reminders_status ON scheduled_reminders(status);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE axes ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_axes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reminders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Axes policies
CREATE POLICY "Users can view own axes" ON axes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own axes" ON axes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own axes" ON axes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own axes" ON axes FOR DELETE USING (auth.uid() = user_id);

-- Topics policies
CREATE POLICY "Users can view own topics" ON topics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own topics" ON topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own topics" ON topics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own topics" ON topics FOR DELETE USING (auth.uid() = user_id);

-- Topic axes policies
CREATE POLICY "Users can view own topic axes" ON topic_axes FOR SELECT 
  USING (EXISTS (SELECT 1 FROM topics WHERE topics.id = topic_axes.topic_id AND topics.user_id = auth.uid()));
CREATE POLICY "Users can insert own topic axes" ON topic_axes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM topics WHERE topics.id = topic_axes.topic_id AND topics.user_id = auth.uid()));
CREATE POLICY "Users can update own topic axes" ON topic_axes FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM topics WHERE topics.id = topic_axes.topic_id AND topics.user_id = auth.uid()));
CREATE POLICY "Users can delete own topic axes" ON topic_axes FOR DELETE 
  USING (EXISTS (SELECT 1 FROM topics WHERE topics.id = topic_axes.topic_id AND topics.user_id = auth.uid()));

-- Events policies
CREATE POLICY "Users can view own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Event values policies
CREATE POLICY "Users can view own event values" ON event_values FOR SELECT 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_values.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can insert own event values" ON event_values FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = event_values.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can update own event values" ON event_values FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_values.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can delete own event values" ON event_values FOR DELETE 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_values.event_id AND events.user_id = auth.uid()));

-- Reminders policies
CREATE POLICY "Users can view own reminders" ON reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON reminders FOR DELETE USING (auth.uid() = user_id);

-- Scheduled reminders policies
CREATE POLICY "Users can view own scheduled reminders" ON scheduled_reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scheduled reminders" ON scheduled_reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scheduled reminders" ON scheduled_reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scheduled reminders" ON scheduled_reminders FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_axes_updated_at BEFORE UPDATE ON axes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_reminders_updated_at BEFORE UPDATE ON scheduled_reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
