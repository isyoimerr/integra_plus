import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { levelController } from '../controllers/level.controller.js';

const router = Router();

router.get('/',           auth, levelController.getAll);
router.get('/progress',   auth, levelController.getProgress);
router.post('/complete',  auth, levelController.complete);

export default router;
