import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    magicLink: string;
    magicLinkExpiration: Date;
    pastriesWon: string[] | null;
    triesNumber: number;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    magicLink: { type: String, required: false },
    magicLinkExpiration: { type: Date, required: false },
    pastriesWon: { type: [String], required: false },
    triesNumber: { type: Number, required: false },
});

export default mongoose.model<IUser>('User', UserSchema);