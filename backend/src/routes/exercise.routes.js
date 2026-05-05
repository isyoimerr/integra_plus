import { Router } from 'express';
import { auth, soloDocente } from '../middleware/auth.middleware.js';
import { exerciseController } from '../controllers/exercise.controller.js';

const router = Router();

router.post('/verify',              auth, exerciseController.verify);
router.get('/nivel/:nivelId',       auth, exerciseController.getByNivel);
router.get('/:id',                  auth, exerciseController.getById);
router.post('/',        auth, soloDocente, exerciseController.create);
router.put('/:id',      auth, soloDocente, exerciseController.update);
router.delete('/:id',   auth, soloDocente, exerciseController.delete);

export default router;
