import { api } from './api';

export const teacherService = {
  getStats:          (token) => api.get('/teacher/stats', token),
  getStudentsAtRisk: (token) => api.get('/teacher/students-at-risk', token),
};
