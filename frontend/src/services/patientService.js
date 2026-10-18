import api from './api';

export const getMyProfile = () => api.get('/patients/profile');
export const createProfile = (data) => api.post('/patients/profile', data);
export const updateProfile = (data) => api.put('/patients/profile/update', data);
export const getAllPatients = () => api.get('/patients/all');
