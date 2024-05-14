import Pastries, { PastryWon } from '../models/pastry';

/**
 * Counts the total number of pastries left in stock.
 * @returns A Promise that resolves to the number of pastries left.
 */
export const countPastriesLeft = async(): Promise<number> => {
    const allPastries = await Pastries.find();
    return allPastries.reduce((acc, pastry) => acc + pastry.stock, 0);
};

/**
 * Retrieves and attributes pastries based on the given quantity and the number of pastries left.
 * 
 * @param quantity - The desired quantity of pastries to be attributed.
 * @param pastriesLeft - The number of pastries left.
 * @returns A promise that resolves to an array of `PastryWon` objects representing the attributed pastries.
 */
export const getAndAttributePastriesLeft = async(quantity: number, pastriesLeft: number): Promise<PastryWon[]> => {
    // get all pastries with stock > 0
    const pastries = await Pastries.find({stock: {$gt: 0}})

    const attributedPastries: PastryWon[] = [];
    let remainingQuantity = quantity;

    // while there are pastries left and the user has not been attributed all its pastries
    while (remainingQuantity > 0 && pastriesLeft > 0) {
        let randomIndex = Math.floor(Math.random() * pastries.length);
        let randomPastry = pastries[randomIndex];
        while (randomPastry.stock === 0) {
            randomIndex = Math.floor(Math.random() * pastries.length);
            randomPastry = pastries[randomIndex];
        }
        randomPastry.stock --;
        remainingQuantity --;
        const existingPastryIndex = attributedPastries.findIndex(pastry => pastry.name === randomPastry.name);
        if (existingPastryIndex !== -1) {
            attributedPastries[existingPastryIndex].quantity ++;
        } else {
            attributedPastries.push({name: randomPastry.name, quantity: 1});
        }
        await randomPastry.save();
    }
    return attributedPastries;
}