import { Pastrywon } from './pastry.model';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    token: string;
    triesLeft: number;
    pastriesWon: Pastrywon[]; 
}