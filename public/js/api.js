// API communication layer
const API = {
    baseURL: '',

    async request(endpoint, options = {}) {
        const response = await fetch(this.baseURL + endpoint, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    },

    async register(username, password) {
        return this.request('/api/register', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    async login(username, password) {
        return this.request('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    async logout() {
        return this.request('/api/logout', {
            method: 'POST'
        });
    },

    async getMe() {
        return this.request('/api/me');
    },

    async getProgress() {
        return this.request('/api/progress');
    },

    async saveProgress(levelId, data) {
        return this.request('/api/progress', {
            method: 'POST',
            body: JSON.stringify({
                levelId,
                ...data
            })
        });
    },

    async getLevelProgress(levelId) {
        return this.request(`/api/progress/${levelId}`);
    }
};
