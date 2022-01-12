import { fetchClient } from './fetch';

const login = (user) => fetchClient.post('/auth/login', user);

export const authService = {
    login,
};