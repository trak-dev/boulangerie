import { rollDices, countPastriesWon } from "../core/games";
import { canUserPlay, getScoreBoard } from "../core/users";
import { countPastriesLeft, getAndAttributePastriesLeft } from "../core/pastries";
import { IUser, UsersLeaderBoard } from "../models/user";
import { PastryWon, playResultObject } from "../models/pastry";

/**
 * Plays the game and returns the result.
 * @param user - The user playing the game.
 * @returns A promise that resolves to an object containing the attributed pastries and the number of tries left.
 * @throws Error if the user is not allowed to play or if there are no pastries left.
 */
export const play = async (user: IUser): Promise<playResultObject> => {
    // check if user is allowed to play
    const isUserAllowedToPlay = await canUserPlay(user);
    if (!isUserAllowedToPlay) throw new Error('User is not allowed to play');

    // check if there are pastries left
    const pastriesLeft = await countPastriesLeft();
    if (pastriesLeft === 0) throw new Error('No pastries left');

    // roll the dices
    const scores = rollDices();

    // count the pastries won
    const pastriesWon = countPastriesWon(scores);

    // update user data
    user.triesLeft --;

    let attributedPastries: PastryWon[] = [];

    if (!pastriesWon) {
        await user.save();
    } else {
        // get pastries array and change the stock
        attributedPastries = await getAndAttributePastriesLeft(pastriesWon , pastriesLeft);

        console.log("attributed", attributedPastries);

        user.pastriesWon = [...attributedPastries];
        await user.save();
    }

    return { attributedPastries , triesLeft: user.triesLeft, dices: scores};
};

/**
 * Gets the scoreboard.
 * @returns A promise that resolves to an array of users sorted by the number of pastries won.
 */
export const getScoreboard = async (): Promise<UsersLeaderBoard[]> => {
    return await getScoreBoard();
}

/**
 * Checks if all pastries have been won.
 * @returns A promise that resolves to a boolean indicating if all pastries have been won.
 */
export const areAllPastriesWon = async (): Promise<boolean> => {
    const pastriesLeft = await countPastriesLeft();
    return pastriesLeft === 0;
}