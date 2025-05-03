import apiClient from './apiClient';

class ImageService {

    async getById(imageId) {
        return await apiClient.get(`/images/${imageId}`, {authRequired: false});
    }

    async create(imageId, imageData) {
        return await apiClient.post(`/images/${imageId}`, imageData, {authRequired: true});
    }

    async update(imageId, imageData) {
        return await apiClient.patch(`/image/${imageData}`, imageData, {authRequired: true});
    }

    async delete(imageId) {
        return await apiClient.delete(`/images/${imageId}`, {authRequired: true});
    }
}

export default new ImageService();