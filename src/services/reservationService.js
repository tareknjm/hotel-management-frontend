import api from './api';

export const reservationService = {
  create:           (data)         => api.post('/reservations', data),
  getAll:           ()             => api.get('/reservations'),
  getMesReservations: ()           => api.get('/reservations/mes-reservations'),
  updateStatut:     (id, statut)   => api.patch(`/reservations/${id}/statut?statut=${statut}`),
  annuler:          (id)           => api.patch(`/reservations/${id}/annuler`),
};