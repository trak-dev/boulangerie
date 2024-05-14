import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';

export const tokenVerification = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }
    try {
        jwt.verify(token, config.jwt.secret);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}