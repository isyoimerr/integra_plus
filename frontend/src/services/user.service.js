import { api } from './api';

export const userService = {
  getStats:       (token)           => api.get('/user/stats', token),
  updateTema:     (token, tema)     => api.patch('/user/tema', { tema }, token),
  updateProfile:  (token, data)     => api.put('/user/profile', data, token),
  getSigma:       (token)           => api.get('/user/sigma', token),
  updateSigma:    (token, data)     => api.put('/user/sigma', data, token),
};
