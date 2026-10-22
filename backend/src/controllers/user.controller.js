import { userService } from '../services/user.service.js';

export const userController = {
  getStats: async (req, res, next) => {
    try { res.json(await userService.getStats(req.userId)); } catch (err) { next(err); }
  },

  updateTema: async (req, res, next) => {
    try {
      const { tema } = req.body;
      if (!['light','dark','custom'].includes(tema)) return res.status(400).json({ error: 'Tema inválido' });
      await userService.updateTema(req.userId, tema);
      res.json({ success: true, tema });
    } catch (err) { next(err); }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { nombre, foto } = req.body;
      const updated = await userService.updateProfile(req.userId, { nombre, foto });
      res.json({ success: true, usuario: { id: updated.usuId, nombre: updated.usuNombre, email: updated.usuCorreo, foto: updated.usuFoto } });
    } catch (err) { next(err); }
  },

  getSigma: async (req, res, next) => {
    try {
      const sigma = await userService.getSigmaState(req.userId);
      res.json(sigma);
    } catch (err) { next(err); }
  },

  updateSigma: async (req, res, next) => {
    try {
      await userService.updateSigmaState(req.userId, req.body);
      res.json({ success: true });
    } catch (err) { next(err); }
  },
};
