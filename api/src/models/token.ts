export interface Token {
    email: string;
    triesNumber: number;
    pastriesWon: string[];
    name: string;
    id: string;
    iat: number;
    exp: number;
}