import { api } from './api';

export const authService = {
  login:     (email, password)       => api.post('/auth/login',   { email, password }),
  register:  (email, nombre, password, rol, teacherCode) => api.post('/auth/register', { email, nombre, password, rol, teacherCode }),
  sendOtp:   (email)               => api.post('/auth/send-otp', { email }),
  verifyOtp: (email, code)           => api.post('/auth/verify-otp', { email, code }),
  solicitarRecuperacion: (email)     => api.post('/auth/solicitar-recuperacion', { email }),
  verificarCodigo:      (email, codigo) => api.post('/auth/verificar-codigo', { email, codigo }),
  resetearContrasena:   (email, tempToken, newPassword) => api.post('/auth/resetear-contrasena', { email, tempToken, newPassword }),
};
