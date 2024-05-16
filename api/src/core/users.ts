import User, { IUser, UsersLeaderBoard } from '../models/user';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { addMinutes } from 'date-fns';
import jwt from 'jsonwebtoken';
import { sendEmail } from './emails';
import { config } from '../config/config';
import sanitize from 'sanitize-html';

/**
 * Registers a new user.
 * @param email - The email of the user.
 * @param name - The name of the user.
 * @throws Error if the user already exists.
 * @returns A promise that resolves to void.
 */
export const register = async (email: string, name: string, password: string | null = null): Promise<IUser | void> => {
    // create a new user object
    const user = {
        email,
        name: sanitize(name),
        magicLink: '',
        magicLinkExpiration: new Date(),
        pastriesWon: [],
        password: '',
        triesLeft: 3
    };

    let hashedPassword = '';

    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    } else {
        const randomPassword = crypto.randomBytes(20).toString('hex');
        hashedPassword = await bcrypt.hash(randomPassword, 10);
        // generate a magic link and an expiration date, 15 minuts from now
        user.magicLink = crypto.randomBytes(20).toString('hex');
        user.magicLinkExpiration = addMinutes(new Date(), 15);
    }

    user.password = hashedPassword;

    // save the user in the database
    const newUser: IUser = new User(user);
    await newUser.save();

    if (password) return await passwordLogin(email, password);

    // parse the magic link
    user.magicLink = encodeURIComponent(user.magicLink);

    // create a welcome message
    const welcomeMessage = `Bienvenue chez Pastry yamms ${user.name}! Vous pouvez maintenant vous connecter en utilisant le lien suivant: ${config.frontUrl}/login?magicLink=${user.magicLink}, il expirera dans 15 minutes. Profitez du jeu!`;

    // send an email with the magic link
    return await sendEmail(
        user.email,
        'Bienvenue chez Pastry yamms!',
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
export const login = async (magicLink: string): Promise<IUser> => {
    // search for the user in the database
    const user = await User.findOne({
        magicLink
    });
    if (!user) throw new Error('Utilisateur non trouvé ❌');
    // compare the magic link from the request with the one in the database
    let isMagicLinkValid = magicLink === user.magicLink;
    // compare the expiration date of the magic link with the current date
    isMagicLinkValid = isMagicLinkValid && user.magicLinkExpiration > new Date();
    if (!isMagicLinkValid) throw new Error('Lien magique invalide ❌');
    // delete the magic link from the database
    user.magicLink = '';
    user.magicLinkExpiration = new Date();
    await user.save();
    
    user.password = '';

    const token = jwt.sign({ email: user.email, name: user.name, id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    const userWithToken = user.toObject();
    userWithToken.token = token;
    return userWithToken;
}

/**
 * Gets the user data from a JWT token.
 * @param token - The JWT token.
 * @returns The user data.
 */
export const getUserFromId = async (id: string): Promise<IUser | undefined> => {
    return await User.findById(id) || undefined;
}

/**
 * Sends a magic link to the user to login.
 * @param email - The email of the user.
 * @returns A Promise that resolves to void.
 * @throws Error if the user is not found.
 */
export const sendMagicLink = async (email: string): Promise<void> => {
    // search for the user in the database
    const user = await User.findOne({ email });
    if (!user) throw new Error('Utilisateur non trouvé ❌');

    // generate a new magic link and expiration date
    user.magicLink = crypto.randomBytes(20).toString('hex');
    user.magicLinkExpiration = addMinutes(new Date(), 15);

    await user.save();

    // safe url parse the magic link
    user.magicLink = encodeURIComponent(user.magicLink);

    const emailMessage = `Salut ${user.name} ! Vous pouvez maintenant vous connecter en utilisant le lien suivant : ${config.frontUrl}/login?magicLink=${user.magicLink}, il expirera dans 15 minutes.`;

    // send an email with the new magic link
    return await sendEmail(user.email, 'Lien magique pour se connecter', emailMessage);
}

/**
 * Checks if a user can play the game.
 * @param user - The user object.
 * @returns A boolean indicating if the user can play.
 * @throws {Error} If the user has no tries left or has already won a pastry.
 */
export const canUserPlay = (user: IUser): boolean => {
    if (user.triesLeft === 0) throw new Error('Plus d\'essais restants ❌');
    if (user.pastriesWon && user.pastriesWon[0]) throw new Error('L\'utilisateur a déjà gagné une pâtisserie 🥐');
    return true;
}

/**
 * Gets the scoreboard.
 * @returns A promise that resolves to an array of users sorted by the number of pastries won.
 */
export const getScoreBoard = async (): Promise<UsersLeaderBoard[]> => {
    const users = await User.find({}, 'name pastriesWon').sort({ pastriesWon: -1 }) as IUser[];
    let usersWithTotalPastries: UsersLeaderBoard[] = [];
    for (const user of users) {
        console.log(user.pastriesWon)
        let totalPastries = 0;
        if (user.pastriesWon) {
            totalPastries = user.pastriesWon.reduce((acc, pastry) => acc + pastry.quantity, 0);
        }
        usersWithTotalPastries.push({ name: user.name, pastriesWon: user.pastriesWon || [], totalPastries});
    }

    return usersWithTotalPastries;
}

export const passwordLogin = async (email: string, password: string): Promise<IUser> => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Utilisateur non trouvé ❌');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Mot de passe invalide ❌');
    user.magicLink = '';
    user.magicLinkExpiration = new Date();
    await user.save();
    user.password = '';
    const token = jwt.sign({ email: user.email, name: user.name, id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    const userWithToken = user.toObject();
    userWithToken.token = token;
    return userWithToken;
};
