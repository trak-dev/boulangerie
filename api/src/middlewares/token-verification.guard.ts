import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import { Token } from '../models/token';
import { getUserFromId } from '../core/users';
import { IUser } from '../models/user';


/**
 * Middleware function to verify the authenticity of a token.
 * Sets the user data in the request object.
 * 
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The next middleware function.
 * @returns A Promise that resolves to void.
 */
export const tokenVerification = async (req: Request, res: Response, next: NextFunction) => {
    // get bearer token from the header
    const bearerToken = req.headers.authorization;

    if (!bearerToken) return res.status(401).json({ message: 'Le token est requis ❗' });
    try {
        const token = bearerToken?.split(' ')[1];
        jwt.verify(token, config.jwt.secret);
        // get the user data from the token and add it to the request
        const decodedToken = jwt.decode(token) as Token;
        const user = await getUserFromId(decodedToken.id);
        if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé ❌' });
        res.locals.user = user as IUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide ❌' });
    }
}