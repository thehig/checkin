export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      axes: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          is_wellness_check: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_wellness_check?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_wellness_check?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      topic_axes: {
        Row: {
          id: string
          topic_id: string
          axis_id: string
          is_required: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          axis_id: string
          is_required?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          axis_id?: string
          is_required?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          notes: string | null
          occurred_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          notes?: string | null
          occurred_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          notes?: string | null
          occurred_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      event_values: {
        Row: {
          id: string
          event_id: string
          axis_id: string
          value: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          axis_id: string
          value: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          axis_id?: string
          value?: number
          created_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          name: string
          trigger_type: string
          trigger_time: string | null
          trigger_event_topic_id: string | null
          trigger_offset_minutes: number | null
          max_time: string | null
          repeat_count: number
          repeat_interval_minutes: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          name: string
          trigger_type: string
          trigger_time?: string | null
          trigger_event_topic_id?: string | null
          trigger_offset_minutes?: number | null
          max_time?: string | null
          repeat_count?: number
          repeat_interval_minutes?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          name?: string
          trigger_type?: string
          trigger_time?: string | null
          trigger_event_topic_id?: string | null
          trigger_offset_minutes?: number | null
          max_time?: string | null
          repeat_count?: number
          repeat_interval_minutes?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      scheduled_reminders: {
        Row: {
          id: string
          user_id: string
          reminder_id: string
          scheduled_for: string
          status: string
          snoozed_until: string | null
          completed_at: string | null
          event_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reminder_id: string
          scheduled_for: string
          status?: string
          snoozed_until?: string | null
          completed_at?: string | null
          event_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reminder_id?: string
          scheduled_for?: string
          status?: string
          snoozed_until?: string | null
          completed_at?: string | null
          event_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
