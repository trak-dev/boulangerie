import { getAllPastries, getPastriesFromUserId } from '../core/pastries';

export const getPastries = () => {
    return getAllPastries();
}

export const getMyPastries = (userId: string) => {
    return getPastriesFromUserId(userId);
}

export const getCountPastriesLeft = async () => {
    const allPastries = await getAllPastries();
   return allPastries.reduce((acc, pastry) => acc + pastry.stock, 0);
}