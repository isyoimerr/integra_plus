import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { userController } from '../controllers/user.controller.js';

const router = Router();

router.get('/stats',      auth, userController.getStats);
router.patch('/tema',     auth, userController.updateTema);
router.put('/profile',    auth, userController.updateProfile);
router.get('/sigma',      auth, userController.getSigma);
router.put('/sigma',      auth, userController.updateSigma);

export default router;
