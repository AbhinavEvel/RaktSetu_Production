import api from './api';

export const getMyAlerts = () => api.get('/alerts/my');
export const respondToAlert = (alertId, response) => api.put(`/alerts/respond/${alertId}`, { response });
