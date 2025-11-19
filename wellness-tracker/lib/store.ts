import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Topic, Axis, TopicWithAxes, Event, ScheduledReminder } from './types';

interface WellnessState {
  topics: TopicWithAxes[];
  axes: Axis[];
  recentEvents: Event[];
  pendingReminders: ScheduledReminder[];
  isOnline: boolean;
  
  setTopics: (topics: TopicWithAxes[]) => void;
  setAxes: (axes: Axis[]) => void;
  addTopic: (topic: TopicWithAxes) => void;
  updateTopic: (id: string, topic: Partial<TopicWithAxes>) => void;
  deleteTopic: (id: string) => void;
  addAxis: (axis: Axis) => void;
  updateAxis: (id: string, axis: Partial<Axis>) => void;
  deleteAxis: (id: string) => void;
  addEvent: (event: Event) => void;
  setRecentEvents: (events: Event[]) => void;
  setPendingReminders: (reminders: ScheduledReminder[]) => void;
  setOnlineStatus: (isOnline: boolean) => void;
}

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set) => ({
      topics: [],
      axes: [],
      recentEvents: [],
      pendingReminders: [],
      isOnline: true,

      setTopics: (topics) => set({ topics }),
      setAxes: (axes) => set({ axes }),
      
      addTopic: (topic) =>
        set((state) => ({ topics: [...state.topics, topic] })),
      
      updateTopic: (id, topic) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === id ? { ...t, ...topic } : t
          ),
        })),
      
      deleteTopic: (id) =>
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
        })),
      
      addAxis: (axis) =>
        set((state) => ({ axes: [...state.axes, axis] })),
      
      updateAxis: (id, axis) =>
        set((state) => ({
          axes: state.axes.map((a) =>
            a.id === id ? { ...a, ...axis } : a
          ),
        })),
      
      deleteAxis: (id) =>
        set((state) => ({
          axes: state.axes.filter((a) => a.id !== id),
        })),
      
      addEvent: (event) =>
        set((state) => ({ 
          recentEvents: [event, ...state.recentEvents].slice(0, 50) 
        })),
      
      setRecentEvents: (events) => set({ recentEvents: events }),
      setPendingReminders: (reminders) => set({ pendingReminders: reminders }),
      setOnlineStatus: (isOnline) => set({ isOnline }),
    }),
    {
      name: 'wellness-storage',
      partialize: (state) => ({
        topics: state.topics,
        axes: state.axes,
      }),
    }
  )
);
