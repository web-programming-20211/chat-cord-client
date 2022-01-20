import { fetchClient } from './fetch';

const getRooms = () => fetchClient.get('/room/retrieve');
const getRoom = (id) => fetchClient.get(`/room/${id}`);
const createRoom = (room) => fetchClient.post('/room/create', room);
const updateRoom = (id, room) => fetchClient.put(`/room/${id}`, room);
const attendRoom = (id) => fetchClient.post(`/room/${id}/attend`);
const addMember = (id, user) => fetchClient.post(`/room/${id}/addMember`, user);
const leaveRoom = (id) => fetchClient.post(`/room/${id}/leave`);
const getMembers = (id) => fetchClient.get(`/room/${id}/members`);
const getUserOnline = (id) => fetchClient.get(`/room/${id}/userOnline`);
const searchMessages = (id, mess) => fetchClient.get(`/room/${id}/messages/${mess}`); 
export const roomService = {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    attendRoom,
    addMember,
    leaveRoom,
    getMembers,
    searchMessages
};