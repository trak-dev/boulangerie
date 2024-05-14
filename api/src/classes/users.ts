import { register, login } from "../core/users";

export const registerUser = (email: string, name: string) => {
    return register(email, name);
}    

export const loginUser = (magicLink: string) => {
    return login(magicLink);
}