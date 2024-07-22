import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Adjust this to your API URL
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('Authorization');
        if (token) {
            config.headers['Authorization'] = `${token}`; 
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors and token refresh if needed
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
           
            window.location.href = '/login';
        }
        console.error('Axios response error:', error.response);
        return Promise.reject(error);
    }
);

export default axiosInstance;
