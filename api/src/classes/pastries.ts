import { getAllPastries, getPastriesFromUserId } from '../core/pastries';

export const getPastries = () => {
    return getAllPastries();
}

export const getMyPastries = (userId: string) => {
    return getPastriesFromUserId(userId);
}