import { api } from './api';

export const levelService = {
  getAll:      (token)                     => api.get('/level', token),
  getProgress: (token)                     => api.get('/level/progress', token),
  complete:    (token, nivelId, errores=0) => api.post('/level/complete', { nivelId, errores }, token),
};
