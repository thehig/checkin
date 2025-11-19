import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper to convert camelCase to snake_case
const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  const snakeCaseObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      snakeCaseObj[snakeKey] = toSnakeCase(obj[key]);
    }
  }
  return snakeCaseObj;
};

// Helper to convert snake_case to camelCase
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  const camelCaseObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelCaseObj[camelKey] = toCamelCase(obj[key]);
    }
  }
  return camelCaseObj;
};

// Sync helpers
export const syncToCloud = async (table: string, data: any[], userId: string) => {
  if (!userId) return { error: new Error('User not authenticated') };
  
  // Add user_id and convert to snake_case
  const dataWithUserId = data.map(item => {
    const snakeCaseItem = toSnakeCase(item);
    return {
      ...snakeCaseItem,
      user_id: userId,
    };
  });
  
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
  
  // Convert snake_case to camelCase
  const camelCaseData = data ? toCamelCase(data) : null;
  
  return { data: camelCaseData, error };
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

