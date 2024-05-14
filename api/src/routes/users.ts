import { Router, Request, Response, NextFunction } from 'express';
import Pastry, { IPastry } from '../models/pastry'; 
import { userSchema, loginSchema } from '../validators/user';
import { registerUser, loginUser } from '../classes/users';
import { sendEmail } from '../core/emails';

const router = Router();

router.post('/magic-login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { magicLink } = loginSchema.parse(req.body);
        const token = await loginUser(magicLink);
        return res.status(200).send({ token });
    } catch (error) {
        return next(error);
    }
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name } = userSchema.parse(req.body);
        await registerUser(email, name);
        return res.status(200).send("Magic link sent!");
    } catch (error) {
        return next(error);
    }
});

export default router;