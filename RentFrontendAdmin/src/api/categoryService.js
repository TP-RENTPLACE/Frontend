import apiClient from './apiClient';

class CategoryService {
    async getAll(params = {}) {
        return await apiClient.get('/categories/', { params, authRequired: false });
    }

    async getById(categoryId) {
        return await apiClient.get(`/categories/${categoryId}`, {authRequired: false});
    }

    async create(categoryData) {
        return await apiClient.post('/categories/', categoryData, {authRequired: true});
    }

    async update(categoryId, categoryData) {
        return await apiClient.patch(`/categories/${categoryId}`, categoryData, {authRequired: true});
    }

    async delete(categoryId) {
        return await apiClient.delete(`/categories/${categoryId}`, {authRequired: true});
    }
}

export default new CategoryService();