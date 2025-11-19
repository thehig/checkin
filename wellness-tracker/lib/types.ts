export interface Profile {
  id: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Axis {
  id: string;
  user_id: string;
  name: string;
  icon?: string;
  description?: string;
  min_value: number;
  max_value: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  user_id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  is_wellness_check: boolean;
  created_at: string;
  updated_at: string;
}

export interface TopicAxis {
  id: string;
  topic_id: string;
  axis_id: string;
  order_index: number;
  created_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  topic_id?: string;
  notes?: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface EventValue {
  id: string;
  event_id: string;
  axis_id: string;
  value: number;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  name: string;
  trigger_topic_id?: string;
  target_topic_id?: string;
  offset_minutes?: number;
  fixed_time?: string;
  is_time_based: boolean;
  repeat_count: number;
  repeat_interval_minutes?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduledReminder {
  id: string;
  reminder_id: string;
  user_id: string;
  trigger_event_id?: string;
  scheduled_for: string;
  status: 'pending' | 'snoozed' | 'completed' | 'dismissed';
  snoozed_until?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface TopicWithAxes extends Topic {
  axes?: (TopicAxis & { axis: Axis })[];
}

export interface EventWithValues extends Event {
  topic?: Topic;
  values: (EventValue & { axis: Axis })[];
}

export interface AxisValue {
  axis_id: string;
  axis_name: string;
  value: number;
  icon?: string;
}

// Form types
export interface CreateEventInput {
  topic_id: string;
  values: Record<string, number>;
  notes?: string;
  occurred_at?: Date;
  include_wellness?: boolean;
  wellness_values?: {
    mental: number;
    physical: number;
    emotional: number;
  };
}

export interface CreateTopicInput {
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  axis_ids: string[];
  is_wellness_check?: boolean;
}

export interface CreateAxisInput {
  name: string;
  icon?: string;
  description?: string;
  min_value?: number;
  max_value?: number;
}

export interface CreateReminderInput {
  name: string;
  trigger_topic_id?: string;
  target_topic_id?: string;
  offset_minutes?: number;
  fixed_time?: string;
  is_time_based: boolean;
  repeat_count?: number;
  repeat_interval_minutes?: number;
}
