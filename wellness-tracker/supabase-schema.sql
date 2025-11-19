-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Axes (scales like Mental, Physical, Emotional)
CREATE TABLE axes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  min_value NUMERIC(3,1) DEFAULT 0.0,
  max_value NUMERIC(3,1) DEFAULT 5.0,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics (e.g., Wake Up, Breakfast, Medications)
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  description TEXT,
  is_wellness_check BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topic-Axis relationship (which axes belong to which topics)
CREATE TABLE topic_axes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  axis_id UUID REFERENCES axes(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(topic_id, axis_id)
);

-- Events (logged instances of topics with axis values)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  notes TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event values (the actual axis values for an event)
CREATE TABLE event_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  axis_id UUID REFERENCES axes(id) ON DELETE CASCADE NOT NULL,
  value NUMERIC(3,1) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, axis_id)
);

-- Reminders (smart reminders based on event types)
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  trigger_topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  target_topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  offset_minutes INTEGER, -- minutes after trigger event
  fixed_time TIME, -- or fixed time (e.g., 9:30 AM)
  is_time_based BOOLEAN DEFAULT FALSE,
  repeat_count INTEGER DEFAULT 0,
  repeat_interval_minutes INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled reminders (actual scheduled instances)
CREATE TABLE scheduled_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reminder_id UUID REFERENCES reminders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  trigger_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, snoozed, completed, dismissed
  snoozed_until TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_axes_user_id ON axes(user_id);
CREATE INDEX idx_topics_user_id ON topics(user_id);
CREATE INDEX idx_topic_axes_topic_id ON topic_axes(topic_id);
CREATE INDEX idx_topic_axes_axis_id ON topic_axes(axis_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_occurred_at ON events(occurred_at DESC);
CREATE INDEX idx_event_values_event_id ON event_values(event_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_scheduled_reminders_user_id ON scheduled_reminders(user_id);
CREATE INDEX idx_scheduled_reminders_status ON scheduled_reminders(status);
CREATE INDEX idx_scheduled_reminders_scheduled_for ON scheduled_reminders(scheduled_for);

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

-- Topic-Axes policies
CREATE POLICY "Users can view own topic_axes" ON topic_axes FOR SELECT 
  USING (EXISTS (SELECT 1 FROM topics WHERE topics.id = topic_axes.topic_id AND topics.user_id = auth.uid()));
CREATE POLICY "Users can insert own topic_axes" ON topic_axes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM topics WHERE topics.id = topic_axes.topic_id AND topics.user_id = auth.uid()));
CREATE POLICY "Users can update own topic_axes" ON topic_axes FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM topics WHERE topics.id = topic_axes.topic_id AND topics.user_id = auth.uid()));
CREATE POLICY "Users can delete own topic_axes" ON topic_axes FOR DELETE 
  USING (EXISTS (SELECT 1 FROM topics WHERE topics.id = topic_axes.topic_id AND topics.user_id = auth.uid()));

-- Events policies
CREATE POLICY "Users can view own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Event values policies
CREATE POLICY "Users can view own event_values" ON event_values FOR SELECT 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_values.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can insert own event_values" ON event_values FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = event_values.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can update own event_values" ON event_values FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_values.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can delete own event_values" ON event_values FOR DELETE 
  USING (EXISTS (SELECT 1 FROM events WHERE events.id = event_values.event_id AND events.user_id = auth.uid()));

-- Reminders policies
CREATE POLICY "Users can view own reminders" ON reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON reminders FOR DELETE USING (auth.uid() = user_id);

-- Scheduled reminders policies
CREATE POLICY "Users can view own scheduled_reminders" ON scheduled_reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scheduled_reminders" ON scheduled_reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scheduled_reminders" ON scheduled_reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scheduled_reminders" ON scheduled_reminders FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_axes_updated_at BEFORE UPDATE ON axes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scheduled_reminders_updated_at BEFORE UPDATE ON scheduled_reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
