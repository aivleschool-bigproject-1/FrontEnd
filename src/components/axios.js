import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Adjust this to your API URL
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('Authorization');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Log the error response for debugging
        console.error('Axios response error:', error.response);
        return Promise.reject(error);
    }
);

export default axiosInstance;
