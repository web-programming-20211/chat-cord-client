import { fetchClient } from './fetch';

const getRooms = () => fetchClient.get('/room/retrieve');

export const roomService = {
    getRooms,
};