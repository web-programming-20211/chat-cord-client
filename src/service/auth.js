import { fetchClient } from './fetch';

const login = (user) => fetchClient.post('/auth/login', user);
const register = (user) => fetchClient.post('/auth/register', user);
const verify = (user) => fetchClient.post('/auth/verify', user);

export const authService = {
    login,
    register,
    verify
};