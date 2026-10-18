import axios from 'axios';

// Ek centralized Axios instance — poori app isi ko use karegi
const api = axios.create({
    baseURL: 'http://localhost:8080/api',   // Spring Boot backend ka base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// REQUEST INTERCEPTOR — har request jaane se pehle chalta hai
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');   // Login ke baad save kiya hua JWT

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;   // Automatically attach karo
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR — har response aane ke baad chalta hai
api.interceptors.response.use(
    (response) => {
        return response;   // Sahi response ho toh kuch mat karo, aage bhej do
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expire/invalid — user ko logout karke login page pe bhejo
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;