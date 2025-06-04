import apiClient from './apiClient';

class PropertyService {
    async getAll(params = {}) {
        return await apiClient.get('/properties/', { params, authRequired: false });
    }

    async getById(propertyId) {
        return await apiClient.get(`/properties/${propertyId}`, {authRequired: false});
    }

    async create(propertyData) {
        return await apiClient.post('/properties/', propertyData, {authRequired: true});
    }

    async update(propertyId, propertyData) {
        return await apiClient.patch(`/properties/${propertyId}`, propertyData, {authRequired: true});
    }

    async delete(propertyId) {
        return await apiClient.delete(`/properties/${propertyId}`, {authRequired: true});
    }

    async addImages(propertyId, imageData) {
        return await apiClient.post(`/properties/${propertyId}/images`, imageData, {authRequired: true,});
    }
}

export default new PropertyService();