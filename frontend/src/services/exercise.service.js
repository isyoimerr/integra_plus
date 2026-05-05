import { api } from './api';

export const exerciseService = {
  getByNivel: (token, nivelId)         => api.get(`/exercise/nivel/${nivelId}`, token),
  getById:    (token, id)              => api.get(`/exercise/${id}`, token),
  verify:     (token, ex, userAnswer)  => api.post('/exercise/verify', { exerciseId: ex.dbId, userAnswer }, token),
  create:     (token, data)            => api.post('/exercise', data, token),
  update:     (token, id, data)        => api.put(`/exercise/${id}`, data, token),
  delete:     (token, id)              => api.delete(`/exercise/${id}`, token),
};
