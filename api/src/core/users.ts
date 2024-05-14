import User, { IUser } from '../models/user';
import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import jwt from 'jsonwebtoken';
import { sendEmail } from './emails';
import { config } from '../config/config';

/**
 * Registers a new user.
 * @param email - The email of the user.
 * @param name - The name of the user.
 * @throws Error if the user already exists.
 * @returns A promise that resolves to void.
 */
export const register = async (email: string, name: string): Promise<void> => {
    // check if the user already exists
    const isUserExists = await isUserAlreadyExists(email);
    if (isUserExists) throw new Error('User already exists');

    // create a new user object
    const user = {
        email,
        name,
        magicLink: '',
        magicLinkExpiration: new Date(),
        pastriesWon: [],
        triesNumber: 0
    };

    // generate a magic link and an expiration date, 15 minuts from now
    user.magicLink = crypto.randomBytes(20).toString('hex');
    user.magicLinkExpiration = addMinutes(new Date(), 15);

    // save the user in the database
    const newUser: IUser = new User(user);
    await newUser.save();

    // create a welcome message
    const welcomeMessage = `Welcome to the Pastry yamms! You can now login using the following link: http://localhost:3000/login?magicLink=${user.magicLink}, it will expire in 15 mins. Enjoy the game!`;

    // send an email with the magic link
    return await sendEmail(
        user.email,
        'Welcome to the Pastry yamms!',
        welcomeMessage
    );
}

/**
 * Checks if a user with the given email already exists.
 * @param email - The email address to check.
 * @returns A Promise that resolves to a boolean indicating whether the user already exists.
 */
export const isUserAlreadyExists = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ email });
    return !!user;
}

/**
 * Logs in a user using a magic link.
 * @param magicLink - The magic link sent to the user.
 * @returns A Promise that resolves to a JWT token.
 * @throws Error if the user is not found, the magic link is invalid, or there is an error saving the user data.
 */
export const login = async (magicLink: string): Promise<string> => {
    // search for the user in the database
    const user = await User.findOne({
        magicLink
    });
    if (!user) throw new Error('User not found');
    // compare the magic link from the request with the one in the database
    let isMagicLinkValid = magicLink === user.magicLink;
    // compare the expiration date of the magic link with the current date
    isMagicLinkValid = isMagicLinkValid && user.magicLinkExpiration > new Date();
    if (!isMagicLinkValid) throw new Error('Invalid magic link');
    // delete the magic link from the database
    user.magicLink = '';
    user.magicLinkExpiration = new Date();
    await user.save();

    // get important user data
    const { email, triesNumber, pastriesWon, name } = user;
    // return a JWT token
    return jwt.sign({  email, triesNumber, pastriesWon, name }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}
