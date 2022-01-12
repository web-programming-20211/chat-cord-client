import { fetchClient } from './fetch';

const getUser = () => fetchClient.get('/user/find');

export const userService = {
    getUser,
};