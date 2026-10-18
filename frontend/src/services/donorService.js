import api from './api';

export const getMyProfile = () => api.get('/donor/profile');
export const createProfile = (data) => api.post('/donor/profile', data);
export const updateProfile = (data) => api.put('/donor/profile', data);
export const updateAvailability = (isAvailable) => api.put('/donor/availability', { isAvailable });
export const getAllDonors = () => api.get('/donor/all');
