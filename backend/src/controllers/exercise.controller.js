import { exerciseService } from '../services/exercise.service.js';

export const exerciseController = {
  getById: async (req, res, next) => {
    try {
      res.json(await exerciseService.getById(parseInt(req.params.id)));
    } catch (err) { next(err); }
  },

  getByNivel: async (req, res, next) => {
    try {
      res.json(await exerciseService.getByNivel(parseInt(req.params.nivelId)));
    } catch (err) { next(err); }
  },

  verify: async (req, res, next) => {
    try {
      const { exerciseId, userAnswer } = req.body;
      if (!exerciseId || !userAnswer) return res.status(400).json({ error: 'exerciseId y userAnswer son requeridos' });
      res.json(await exerciseService.verify(req.estudianteId, parseInt(exerciseId), userAnswer));
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      res.status(201).json(await exerciseService.create(req.body));
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      res.json(await exerciseService.update(parseInt(req.params.id), req.body));
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await exerciseService.delete(parseInt(req.params.id));
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
