import api from './api';

export const getAllInventory = () => api.get('/inventory/all');
export const addInventory = (data) => api.post('/inventory/add', data);
export const updateInventory = (id, data) => api.put(`/inventory/update/${id}`, data);
export const deleteInventory = (id) => api.delete(`/inventory/delete/${id}`);