import api from './api';

export const getPublicStats = () => api.get('/public/stats');
