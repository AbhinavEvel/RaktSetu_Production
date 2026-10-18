import api from './api';

export const getStockSummary = () => api.get('/reports/stock-summary');
export const getMonthlyDonations = () => api.get('/reports/donations-monthly');
export const getRequestsSummary = () => api.get('/reports/requests-summary');
export const getExpiryAlerts = () => api.get('/reports/expiry-alerts');
