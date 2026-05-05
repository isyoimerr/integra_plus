import { api } from './api';

export const userService = {
  getStats:    (token)        => api.get('/user/stats', token),
  updateTema:  (token, tema)  => api.patch('/user/tema', { tema }, token),
};
