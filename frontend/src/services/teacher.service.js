import { api } from './api';

export const teacherService = {
  getStats:          (token) => api.get('/teacher/stats', token),
  getStudents:       (token) => api.get('/teacher/students', token),
  getStudentsAtRisk: (token) => api.get('/teacher/students-at-risk', token),
  getStudentProgress: (token, id) => api.get(`/teacher/students/${id}/progress`, token),
};
