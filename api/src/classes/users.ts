import { register, login, sendMagicLink, isUserAlreadyExists, passwordLogin } from "../core/users";

export const registerUser = async (email: string, name: string, password: string | null = null) => {
    const userExists = await isUserAlreadyExists(email);
    if (userExists) throw new Error('User already exist');
    return register(email, name, password);
}    

export const loginUser = (magicLink: string) => {
    return login(magicLink);
}

/**
 * Sends a magic link for login to the specified email address.
 * 
 * @param email - The email address to send the magic link to.
 * @throws Error if the user does not exist.
 * @returns A promise that resolves when the magic link is sent.
 */
export const sendMagicLinkForLogin = async (email: string) => {
    const userExists = await isUserAlreadyExists(email);
    if (!userExists) throw new Error('L\'utilisateur n\'existe pas ❌');
    return sendMagicLink(email);
}

export const loginWithPassword = async (email: string, password: string) => {
    return passwordLogin(email, password);
}