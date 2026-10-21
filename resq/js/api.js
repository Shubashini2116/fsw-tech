// Dynamic API Base URL configuration:
// 1. Explicit remote API override if set in window.TASKFLOW_API_URL
// 2. Same-origin /api if served over HTTP/HTTPS (cloud deployment / public URL)
// 3. Fallback to local Spring Boot (http://localhost:8080/api) if opened via file://
const API_BASE = window.TASKFLOW_API_URL || (
    window.location.origin && window.location.origin.startsWith('http')
        ? `${window.location.origin}/api`
        : 'http://localhost:8080/api'
);

const api = {
    getToken() {
        return localStorage.getItem('taskflow_token');
    },

    getUser() {
        try {
            return JSON.parse(localStorage.getItem('taskflow_user'));
        } catch (e) {
            return null;
        }
    },

    setSession(token, user) {
        localStorage.setItem('taskflow_token', token);
        localStorage.setItem('taskflow_user', JSON.stringify(user));
    },

    clearSession() {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
    },

    async request(path, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            const errorMsg = json.message || `Request failed with status ${res.status}`;
            throw new Error(errorMsg);
        }

        return json.data !== undefined ? json.data : json;
    },

    // Tasks API
    async getDashboardStats() {
        return this.request('/tasks/dashboard');
    },

    async getTasks({ status, priority, search } = {}) {
        const params = new URLSearchParams();
        if (status && status !== 'all') params.append('status', status);
        if (priority && priority !== 'all') params.append('priority', priority);
        if (search && search.trim()) params.append('search', search.trim());

        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/tasks${query}`);
    },

    async getTask(id) {
        return this.request(`/tasks/${id}`);
    },

    async createTask(taskData) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    },

    async updateTask(id, taskData) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    },

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE'
        });
    },

    // Auth API
    async register(username, email, password) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        if (data.token) {
            this.setSession(data.token, { username: data.username, email: data.email });
        }
        return data;
    },

    async login(username, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        if (data.token) {
            this.setSession(data.token, { username: data.username, email: data.email });
        }
        return data;
    }
};

window.api = api;
