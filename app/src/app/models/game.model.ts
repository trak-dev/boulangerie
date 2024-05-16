export interface PastryWon {
    name: string;
    quantity: number;
    url: string;
  }
  
  export interface playResultObject {
    attributedPastries: PastryWon[];
    triesLeft: number;
    dices: number[]
  }

  export interface UsersLeaderBoard {
    name: string;
    pastriesWon: {
      name: string;
      quantity: number;
      url: string;
      updatedAt: string;
    }[];
    totalPastries: number;
  }