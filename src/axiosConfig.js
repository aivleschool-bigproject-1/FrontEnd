// src/axiosConfig.js

import axios from 'axios';

// Set the base URL for Axios requests
axios.defaults.baseURL = 'http://localhost:8080'; // Adjust this to your backend base URL

// Add a request interceptor to include the token in headers
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axios;
