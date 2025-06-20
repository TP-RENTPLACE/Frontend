import apiClient from './apiClient';

class UserService {
    async getAll(params = {}) {
        return await apiClient.get('/users/', { params, authRequired: false });
    }

    async getById(userId) {
        return await apiClient.get(`/users/${userId}`, {authRequired: false});
    }

    async create(userData) {
        return await apiClient.post('/users/', userData, {authRequired: true});
    }

    async update(userId, userData) {
        return await apiClient.patch(`/users/${userId}`, userData, {authRequired: true});
    }

    async delete(userId) {
        return await apiClient.delete(`/users/admin/${userId}`, {authRequired: true});
    }

    async updateMe(userData) {
        return await apiClient.patch(`/users/me`, userData, {authRequired: true});
    }

    async blockUser(userId) {
        return await apiClient.get(`/users/admin/block-user/${userId}`, {authRequired: true});
    }

    async activateUser(userId) {
        return await apiClient.get(`/users/admin/activate-user/${userId}`, {authRequired: true});
    }
}

export default new UserService();