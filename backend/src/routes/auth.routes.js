import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register',        authController.register);
router.post('/login',           authController.login);
router.post('/send-otp',        authController.sendOtp);
router.post('/verify-otp',      authController.verifyOtp);
router.post('/solicitar-recuperacion', authController.solicitarRecuperacion);
router.post('/verificar-codigo',      authController.verificarCodigo);
router.post('/resetear-contrasena',    authController.resetearContrasena);

export default router;
