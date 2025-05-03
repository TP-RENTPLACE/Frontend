import apiClient from './apiClient';

export default {
    async requestCode(email) {
        return apiClient.post('/auth/code-request', { email });
    },

    async login(email, code) {
        const response = await apiClient.post('/auth/login', { email, code });
        const { accessToken, refreshToken } = response;
        apiClient.setAuthTokens(accessToken, refreshToken);
        return response;
    },

    async refreshTokens() {
        const response = await apiClient.refresh();
        apiClient.setAuthTokens(response.accessToken, response.refreshToken);
        return response;
    }

};