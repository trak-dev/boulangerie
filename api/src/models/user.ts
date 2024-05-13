import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    pastriesWon: string[] | null;
    triesNumber: number;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pastriesWon: { type: [String], required: true },
    triesNumber: { type: Number, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);