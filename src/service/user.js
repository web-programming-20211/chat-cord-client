import { fetchClient } from './fetch';

const getUser = () => fetchClient.get('/user/find');
const updateUser = (id, user) => fetchClient.put(`/user/${id}`, user);
export const userService = {
    getUser,
    updateUser
};