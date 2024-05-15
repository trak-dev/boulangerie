import { Router, Request, Response, NextFunction } from 'express';
import { userSchema, loginSchema, sendMagicLinkSchema, userWithPasswordSchema, loginWithPasswordSchema } from '../validators/user';
import { registerUser, loginUser, sendMagicLinkForLogin, loginWithPassword } from '../classes/users';

const router = Router();

router.post('/magic-login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { magicLink } = loginSchema.parse(req.body);
        const user = await loginUser(magicLink);
        return res.status(200).send(user);
    } catch (error) {
        return next(error);
    }
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name } = userSchema.parse(req.body);
        await registerUser(email, name);
        return res.status(200).send({success: "Magic link sent!"});
    } catch (error) {
        return next(error);
    }
});

router.post('/send-magic-link', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = sendMagicLinkSchema.parse(req.body);
        await sendMagicLinkForLogin(email);
        return res.status(200).send({success: "Magic link sent!"});
    } catch (error) {
        return next(error);
    }
});

router.put('/password-register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, password } = userWithPasswordSchema.parse(req.body);
        const user = await registerUser(email, name, password);
        return res.status(200).send(user);
    } catch (error) {
        return next(error);
    }
});

router.post('/password-login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = loginWithPasswordSchema.parse(req.body);
        const user = await loginWithPassword(email, password);
        return res.status(200).send(user);
    } catch (error) {
        return next(error);
    }
});

router.get('/isUserConnected', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).send({ connected: true });
    } catch (error) {
        return next(error);
    }
});

export default router;