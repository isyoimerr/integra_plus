import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si no hay credenciales configuradas, exportamos null y el AuthContext usa el backend
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('...'))
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const useSupabase = () => !!supabase;
