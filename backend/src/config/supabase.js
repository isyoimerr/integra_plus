import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const createSupabaseClient = (url, key) => {
  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

export const supabase = createSupabaseClient(env.supabaseUrl, env.supabaseAnonKey);
export const supabaseAdmin = createSupabaseClient(env.supabaseUrl, env.supabaseServiceRoleKey);
