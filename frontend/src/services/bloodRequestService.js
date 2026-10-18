import api from './api';

export const createRequest = (data) => api.post('/requests/create', data);
export const getRequestsByPatient = (patientId) => api.get(`/requests/patient/${patientId}`);
export const getAllRequests = () => api.get('/requests/all');
export const updateRequestStatus = (id, status) => api.put(`/requests/status/${id}`, { status });
export const getMatchedDonors = (requestId) => api.get(`/requests/match/${requestId}`);
export const rematchDonors = (requestId) => api.post(`/requests/rematch/${requestId}`);
export const cancelOwnRequest = (id) => api.put(`/requests/cancel/${id}`);
export const editOwnRequest = (id, data) => api.put(`/requests/edit/${id}`, data);
