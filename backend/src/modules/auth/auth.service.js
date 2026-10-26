import { getSupabaseUserByToken } from '../../services/supabase.service.js';

export const authService = {
  async getAuthenticatedUser(token) {
    return getSupabaseUserByToken(token);
  },
};
