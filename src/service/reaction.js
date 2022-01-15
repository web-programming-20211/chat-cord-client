import { fetchClient } from './fetch';

const getReactionsByMessage = (id) => fetchClient.get(`/reaction/retrieve`, id);

export const reactionService = {
    getReactionsByMessage
};