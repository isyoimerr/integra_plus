import { levelService } from '../services/level.service.js';

export const levelController = {
  getAll: async (_req, res, next) => {
    try { res.json(await levelService.getAll()); } catch (err) { next(err); }
  },

  getProgress: async (req, res, next) => {
    try { res.json(await levelService.getProgress(req.estudianteId)); } catch (err) { next(err); }
  },

  complete: async (req, res, next) => {
    try {
      const { nivelId, errores } = req.body;
      if (!nivelId) return res.status(400).json({ error: 'nivelId es requerido' });
      res.json(await levelService.complete(req.estudianteId, parseInt(nivelId), errores || 0));
    } catch (err) { next(err); }
  },
};
