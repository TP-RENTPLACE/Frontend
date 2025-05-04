import apiClient from './apiClient';

class ReservationService {
    async getAll(params = {}) {
        return await apiClient.get('/reservations/', { params, authRequired: false });
    }

    async getById(reservationId) {
        return await apiClient.get(`/users/${reservationId}`, { authRequired: true });
    }

    async create(reservationData) {
        return await apiClient.post('/reservations/', reservationData, {authRequired: true});
    }

    async update(reservationId, reservationData) {
        return await apiClient.patch(`/reservations/${reservationId}`, reservationData, {authRequired: true});
    }

    async delete(reservationId) {
        return await apiClient.delete(`/reservations/${reservationId}`, {authRequired: true});
    }
}

export default new ReservationService();