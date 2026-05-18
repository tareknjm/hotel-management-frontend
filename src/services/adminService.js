import api from './api';

export const adminService = {
  getStats:    ()              => api.get('/admin/stats'),
  getUsers:    ()              => api.get('/admin/users'),
  updateRole:  (id, role)      => api.patch(`/admin/users/${id}/role?role=${role}`),
  deleteUser:  (id)            => api.delete(`/admin/users/${id}`),
};