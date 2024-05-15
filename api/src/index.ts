import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors  from 'cors';

import { tokenVerification } from './middlewares/token-verification.guard';
import { config } from './config/config';
import { z } from 'zod';

import userRouter from './routes/users';
import gameRouter from './routes/games';
import pastriesRouter from './routes/pastries';
import { IUser } from './models/user';

const app = express();
const port = config.port;

interface CustomLocals {
    user?: IUser;
}
  
declare module 'express' {
    export interface Response  {
        locals: CustomLocals;
    }
}

// routes that do not require a token
const tokenLessPaths = [
    '/users/magic-login',
    '/users/register',
    '/users/send-magic-link',
    '/game/scoreboard',
    '/game/is-game-over',
    '/pastries',
    '/users/password-login',
    '/users/password-register'
];

// MongoDB connection URL, to be moved to .env file
const mongoUrl = config.mongoUrl;

// body parser middleware to parse JSON body
app.use(bodyParser.json());
app.use(cors());

// middleware to verify token for all routes except the ones in tokenLessPaths
app.use((req, res, next) => {
    // unless paths
    if (tokenLessPaths.includes(req.path)) {
        return next();
    }
    // verify if token is valid
    tokenVerification(req, res, next);
});

// routes subpaths
app.use('/users', userRouter);
app.use('/game', gameRouter);
app.use('/pastries', pastriesRouter);

// error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    // only send error message if it is a string
    if (err instanceof z.ZodError) {
        return res.status(400).send(err.errors);
    } else if (err instanceof Error && err.message) {
        return res.status(500).send(err.message);
    } else {
        return res.status(500).send('Oops! Something went wrong!');
    }
});

// connect to MongoDB
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error(err);
    });

// start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});