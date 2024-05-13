import { register, login } from "../core/users"
import { IUser } from "../models/user";

export const registerUser = async (email: string, password: string, name: string) => {
    return register({ email, password, name, pastriesWon: null, triesNumber: 0} as IUser);
}    

export const loginUser = async (email: string, password: string) => {
    return login(email, password);
}