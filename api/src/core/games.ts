/**
 * Generates an array of 5 random numbers between 1 and 6.
 * 
 * @returns An array of 5 random numbers.
 */
export const rollDices = (): number[] => {
    // generate 5 random numbers between 1 and 6
    return Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1);
}

/**
 * Counts the number of pastries won based on the scores obtained in a game.
 * @param scores - An array of numbers representing the scores obtained in the game.
 * @returns The number of pastries won.
 */
export const countPastriesWon = (scores: number[]): number => {
    const diceScoresMap = new Map<number, number>();
    for (let i = 1; i <= 6; i++) {
      diceScoresMap.set(i, 0);
    }
    for (const score of scores) {
      diceScoresMap.set(score, diceScoresMap.get(score)! + 1);
    }
    
    // now, for our yammps, if we have 5 of the same number, the user wins 3 pastries, if we have 4 of the same number, the user wins 2 pastries, if we have 2 pairs, the user wins 1 pastry
    let pastriesWon = 0;
    let moreThanTwoPairs = 0;

    // for every possible score, check if the user won pastries
    for (const [_, value] of diceScoresMap) {
      
      if (value === 5) {
        pastriesWon = 3;
        break;
      }
      if (value === 4) {
        pastriesWon = 2;
        break;
      }
      if (value >= 2) {
        moreThanTwoPairs++;
        if (moreThanTwoPairs === 2) {
          pastriesWon = 1;
          break;
        }
      }

    }
    
    return pastriesWon;
  }