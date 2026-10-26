import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import { extractBearerToken } from '../utils/authorization.js';

export const verifySupabaseToken = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = user;
    req.userId = user.id;
    req.userEmail = user.email ?? null;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
