-- Supabase Database Schema for Wellness Tracker
-- This is optional and only needed if you want cloud sync

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- We'll just reference auth.users

-- Axes table
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

-- Topics table
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Events table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  axes JSONB DEFAULT '[]',
  notes TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Reminders table
CREATE TABLE reminders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  topic_id TEXT,
  trigger_type TEXT NOT NULL,
  trigger_time TEXT,
  trigger_event_topic_id TEXT,
  trigger_offset_minutes INTEGER,
  trigger_latest_time TEXT,
  repeat_count INTEGER,
  repeat_interval_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  last_triggered BIGINT,
  next_scheduled BIGINT,
  spawns_reminders JSONB,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Reminder instances table
CREATE TABLE reminder_instances (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_id TEXT NOT NULL,
  scheduled_time BIGINT NOT NULL,
  status TEXT NOT NULL,
  completed_event_id TEXT,
  snoozed_until BIGINT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE axes ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_instances ENABLE ROW LEVEL SECURITY;

-- Create policies to restrict access to user's own data
CREATE POLICY "Users can view their own axes" ON axes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own axes" ON axes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own axes" ON axes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own axes" ON axes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own topics" ON topics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own topics" ON topics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own topics" ON topics
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own topics" ON topics
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reminder instances" ON reminder_instances
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own reminder instances" ON reminder_instances
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reminder instances" ON reminder_instances
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reminder instances" ON reminder_instances
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_axes_user_id ON axes(user_id);
CREATE INDEX idx_axes_topic_id ON axes(topic_id);
CREATE INDEX idx_topics_user_id ON topics(user_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminder_instances_user_id ON reminder_instances(user_id);
CREATE INDEX idx_reminder_instances_status ON reminder_instances(status);
CREATE INDEX idx_reminder_instances_scheduled_time ON reminder_instances(scheduled_time);
