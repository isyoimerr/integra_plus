import { authService } from '../services/auth.service.js';
import { sendOtpEmail, sendResetEmail } from '../utils/mailer.js';
import { otpStore } from '../utils/otp.store.js';

const TEACHER_CODE = process.env.TEACHER_CODE || 'DOCENTE2024';

export const authController = {
  register: async (req, res, next) => {
    try {
      const { email, nombre, password, rol, teacherCode } = req.body;
      if (!email || !nombre || !password) return res.status(400).json({ error: 'Faltan campos requeridos' });
      if (rol === 'docente' && teacherCode !== TEACHER_CODE) {
        return res.status(403).json({ error: 'Código docente inválido' });
      }
      const result = await authService.register(email, nombre, password, rol, teacherCode);
      res.status(201).json(result);
    } catch (err) {
      if (err.message === 'El email ya está registrado') {
        return res.status(409).json({ error: err.message });
      }
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err) {
      if (err.message === 'Credenciales inválidas') {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
      }
      next(err);
    }
  },

  // OTP para registro (se mantiene)
  sendOtp: async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email requerido' });
      const code = String(Math.floor(1000 + Math.random() * 9000));
      otpStore.set(email, code);
      await sendOtpEmail(email, code);
      const devCode = process.env.NODE_ENV === 'development' ? code : undefined;
      res.json({ message: 'Código enviado', email, ...(devCode && { devCode }) });
    } catch (err) { next(err); }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) return res.status(400).json({ error: 'Email y código requeridos' });
      if (!otpStore.verify(email, code)) {
        return res.status(400).json({ error: 'Código inválido o expirado' });
      }
      res.json({ verified: true });
    } catch (err) { next(err); }
  },

  // Recuperación con BD
  solicitarRecuperacion: async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email requerido' });
      const codeDb = await authService.solicitarRecuperacion(email);
      if (codeDb) await sendResetEmail(email, codeDb);
      const devCode = process.env.NODE_ENV === 'development' ? codeDb : undefined;
      res.json({ message: 'Si el correo existe, recibirás un código', ...(devCode && { devCode }) });
    } catch (err) { next(err); }
  },

  verificarCodigo: async (req, res, next) => {
    try {
      const { email, codigo } = req.body;
      if (!email || !codigo) return res.status(400).json({ error: 'Email y código requeridos' });
      const tempToken = await authService.verificarCodigo(email, codigo);
      res.json({ message: 'Código válido', tempToken });
    } catch (err) {
      if (err.message === 'Código inválido o expirado') {
        return res.status(400).json({ error: 'Código inválido o expirado' });
      }
      next(err);
    }
  },

  resetearContrasena: async (req, res, next) => {
    try {
      const { email, tempToken, newPassword } = req.body;
      if (!email || !tempToken || !newPassword) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
      }
      await authService.resetearContrasena(email, tempToken, newPassword);
      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (err) {
      if (err.message === 'Token inválido o expirado') {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
      next(err);
    }
  },
};
