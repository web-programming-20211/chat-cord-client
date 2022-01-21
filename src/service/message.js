import { fetchClient } from './fetch';

const getMessages = (id) => fetchClient.get(`message/room/${id}`);

export const messageService = {
    getMessages
};