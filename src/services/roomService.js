import api from './api';

export const roomService = {
  getAll:        ()          => api.get('/rooms'),
  getDisponibles: ()         => api.get('/rooms/disponibles'),
  getById:       (id)        => api.get(`/rooms/${id}`),
  create:        (data)      => api.post('/rooms', data),
  update:        (id, data)  => api.put(`/rooms/${id}`, data),
  updateStatut:  (id, statut)=> api.patch(`/rooms/${id}/statut?statut=${statut}`),
  delete:        (id)        => api.delete(`/rooms/${id}`),
};