import User, { IUser } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (user: IUser): Promise<IUser> => {
    const isUserExists = await isUserAlreadyExists(user.email);
    if (isUserExists) throw new Error('User already exists');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    if (!user.pastriesWon) user.pastriesWon = [];
    const newUser: IUser = new User(user);
    await newUser.save();
    return newUser;
}

export const isUserAlreadyExists = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ email });
    return !!user;
}

export const login = async (email: string, password: string): Promise<string> => {
    const user = await User.findOne({
        email
    });
    if (!user) throw new Error('User not found');
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new Error('Invalid password');
    return jwt.sign({ email }, "mydododosecret", { expiresIn: '1h' });
}
