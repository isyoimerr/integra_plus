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
};
