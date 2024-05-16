import { Router, Request, Response, NextFunction } from 'express';
import { play, getScoreboard, areAllPastriesWon } from '../classes/games';

const router = Router();

router.get('/play', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const playResult = await play(res.locals.user!);
        return res.status(200).send(playResult);
    } catch (error) {
        return next(error);
    }
});

router.get('/scoreboard', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scoreboard = await getScoreboard();
        return res.status(200).send(scoreboard);
    } catch (error) {
        return next(error);
    }
});

router.get('/is-game-over', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isGameOver = await areAllPastriesWon();
        return res.status(200).send({isGameOver});
    } catch (error) {
        return next(error);
    }
});

export default router;