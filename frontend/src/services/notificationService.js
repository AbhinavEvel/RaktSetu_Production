import api from './api';

export const getUserNotifications = (userId) => api.get(`/notifications/user/${userId}`);
export const markAsRead = (id) => api.put(`/notifications/${id}/read`);
export const getAllNotifications = () => api.get('/notifications/all');