import apiClient from './apiClient';

class FacilityService {
    async getAll(params = {}) {
        return await apiClient.get('/facilities/', { params, authRequired: false });
    }

    async getById(facilityId) {
        return await apiClient.get(`/facilities/${facilityId}`, {authRequired: false});
    }

    async create(facilityData) {
        return await apiClient.post('/facilities/', facilityData, {authRequired: true});
    }

    async update(facilityId, facilityData) {
        return await apiClient.patch(`/facilities/${facilityId}`, facilityData, {authRequired: true});
    }

    async delete(facilityId) {
        return await apiClient.delete(`/facilities/${facilityId}`, {authRequired: true});
    }
}

export default new FacilityService();