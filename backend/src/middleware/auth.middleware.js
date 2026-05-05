import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No autorizado' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRol = decoded.rol;
    req.estudianteId = decoded.estudianteId || null;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const soloDocente = (req, res, next) => {
  if (req.userRol !== 'docente') return res.status(403).json({ error: 'Acceso restringido a docentes' });
  next();
};
