import api from './api';

export const getMyDonations = () => api.get('/donations/my');
export const getAllDonations = () => api.get('/donations');
export const getDonationsByDonor = (donorId) => api.get(`/donations/donor/${donorId}`);
export const addDonation = (data) => api.post('/donations', data);
