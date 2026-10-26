import { supabase, supabaseAdmin } from '../config/supabase.js';

export const getSupabaseUserByToken = async (token) => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return null;
  }

  return data.user;
};

export const getUserProfileById = async (userId) => {
  if (!supabaseAdmin) {
    return null;
  }

  const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('user_id', userId).single();

  if (error) {
    return null;
  }

  return data;
};
