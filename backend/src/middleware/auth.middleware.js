import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { extractBearerToken } from '../utils/authorization.js';

const normalizeLocalUser = (decoded) => {
  const userId = decoded.userId ?? decoded.sub ?? decoded.id ?? null;
  const userRol = decoded.rol ?? decoded.role ?? 'estudiante';
  const estudianteId = decoded.estudianteId ?? decoded.estudiante_id ?? null;

  return {
    userId,
    userRol,
    estudianteId,
    user: decoded,
  };
};

const normalizeSupabaseUser = (user) => ({
  userId: user?.id ?? null,
  userRol: user?.user_metadata?.rol ?? 'estudiante',
  estudianteId: user?.user_metadata?.estudianteId ?? null,
  user,
});

const verifySupabaseUser = async (token) => {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

export const auth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const jwtSecret = process.env.JWT_SECRET || env.jwtSecret;
    if (jwtSecret) {
      try {
        const decoded = jwt.verify(token, jwtSecret);
        const normalized = normalizeLocalUser(decoded);
        req.userId = normalized.userId;
        req.userRol = normalized.userRol;
        req.estudianteId = normalized.estudianteId;
        req.user = normalized.user;
        return next();
      } catch {
        // Intentar Supabase como compatible fallback.
      }
    }

    const supabaseUser = await verifySupabaseUser(token);
    if (!supabaseUser) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const normalized = normalizeSupabaseUser(supabaseUser);
    req.userId = normalized.userId;
    req.userRol = normalized.userRol;
    req.estudianteId = normalized.estudianteId;
    req.user = normalized.user;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const soloDocente = (req, res, next) => {
  if (req.userRol !== 'docente') return res.status(403).json({ error: 'Acceso restringido a docentes' });
  next();
};
