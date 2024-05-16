import mongoose, { Schema, Document } from 'mongoose';
import { PastryWon, pastryWonSchema } from './pastry';

export interface IUser extends Document {
    name: string;
    email: string;
    magicLink: string;
    magicLinkExpiration: Date;
    pastriesWon: PastryWon[] | null;
    triesLeft: number;
    password: string;
    token: string;
}

export interface UsersLeaderBoard  {
    name: string;
    pastriesWon: PastryWon[];
    totalPastries: number;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    magicLink: { type: String, required: false },
    magicLinkExpiration: { type: Date, required: false },
    pastriesWon: { type: [pastryWonSchema], required: false },
    triesLeft: { type: Number, required: false },
    password: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);