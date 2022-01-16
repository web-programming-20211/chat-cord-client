import { fetchClient } from './fetch';

const getReactionsByMessage = (id) => fetchClient.get(`/reaction/message/${id}/retrieve`);

export const reactionService = {
    getReactionsByMessage
};