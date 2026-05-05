import { Router } from 'express';
import { auth, soloDocente } from '../middleware/auth.middleware.js';
import { teacherController } from '../controllers/teacher.controller.js';

const router = Router();

router.get('/students-at-risk', auth, soloDocente, teacherController.getStudentsAtRisk);
router.get('/stats',            auth, soloDocente, teacherController.getStats);

export default router;
