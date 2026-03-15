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
    getPorteros: () => api.get('/masters/porteros'),
};

export const MovementsService = {
    getAll: () => api.get('/movements'),
    create: (data) => api.post('/movements', data),
    getMisSolicitudes: (email, page = 1, filtro = 'todos') =>
        api.get(`/movements/mis-solicitudes?email=${encodeURIComponent(email)}&page=${page}&filtro=${filtro}`),
    approve: (id, email) => api.put(`/movements/${id}/approve`, { email }),
    reject: (id, email, observacion) => api.put(`/movements/${id}/reject`, { email, observacion }),
    cancel: (id, email, observacion) => api.put(`/movements/${id}/cancel`, { email, observacion }),
    getStatus: (id) => api.get(`/movements/${id}/status`),
};

export default api;
