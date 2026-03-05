import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const checkPorteria = (email) =>
    axios.get(`${API_URL}/porteria/check`, { params: { email } });

export const getPendientes = (email) =>
    axios.get(`${API_URL}/porteria/pendientes`, { params: { email } });

export const completeMovimiento = (id, { email, horaCompletado, observacionPorteria }) =>
    axios.put(`${API_URL}/porteria/${id}/complete`, { email, horaCompletado, observacionPorteria });

export const getHistorial = (email, { desde, hasta, estado, page } = {}) =>
    axios.get(`${API_URL}/porteria/historial`, {
        params: { email, desde, hasta, estado, page },
    });
