import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sync helpers
export const syncToCloud = async (table: string, data: any[], userId: string) => {
  if (!userId) return { error: new Error('User not authenticated') };
  
  // Add user_id to all records
  const dataWithUserId = data.map(item => ({
    ...item,
    user_id: userId,
  }));
  
  const { error } = await supabase
    .from(table)
    .upsert(dataWithUserId, { 
      onConflict: 'id',
      ignoreDuplicates: false 
    });
  
  return { error };
};

export const syncFromCloud = async (table: string, userId: string) => {
  if (!userId) return { data: null, error: new Error('User not authenticated') };
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
};

export const deleteFromCloud = async (table: string, id: string, userId: string) => {
  if (!userId) return { error: new Error('User not authenticated') };
  
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  return { error };
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return SUPABASE_URL && SUPABASE_ANON_KEY && 
         SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '';
};

