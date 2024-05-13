import { Router, Request, Response, NextFunction } from 'express';
import Pastry, { IPastry } from '../models/pastry'; 
import { userSchema, loginSchema } from '../validators/user';
import { registerUser, loginUser } from '../classes/users';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const token = await loginUser(email, password);
        return res.status(200).send({ token });
    } catch (error) {
        return next(error);
    }
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req.body", req.body);
        const { email, password, name } = userSchema.parse(req.body);
        const newUser = await registerUser(email, password, name);
        return res.status(200).send(newUser);
    } catch (error) {
        return next(error);
    }
});

export default router;