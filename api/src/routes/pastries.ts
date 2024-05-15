import { Router, Request, Response, NextFunction } from 'express';
import { getPastries, getMyPastries } from '../classes/pastries';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pastries = await getPastries();
        return res.status(200).send({pastries});
    } catch (error) {
        return next(error);
    }
});

router.get('/mine', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.user!.id;
        const pastries = await getMyPastries(userId);
        return res.status(200).send({pastries});
    } catch (error) {
        return next(error);
    }
});

export default router;