import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
});

export const MastersService = {
    getLegajos: () => api.get('/masters/legajos'),
    getLugares: () => api.get('/masters/lugares'),
    getMovementTypes: () => api.get('/masters/movement-types'),
    getMovementStates: () => api.get('/masters/movement-states'),
    getMe: (email) => api.get(`/masters/me?email=${email}`),
};

export const MovementsService = {
    getAll: () => api.get('/movements'),
    create: (data) => api.post('/movements', data),
};

export default api;
