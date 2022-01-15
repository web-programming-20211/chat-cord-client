import axios from 'axios';
require('dotenv').config()

const fetchClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
});

const beforeRequest = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        Object.assign(config.headers, { Authorization: `Bearer ${token}` });
    }
    return config;
};

fetchClient.interceptors.request.use(beforeRequest);

export { fetchClient };