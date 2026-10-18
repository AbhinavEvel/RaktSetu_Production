import api from './api';

export const getAllUsers = () => api.get('/auth/users');
export const verifyUser = (userId) => api.put(`/auth/verify/${userId}`);
export const registerAdmin = (data) => api.post('/auth/register-admin', data);
