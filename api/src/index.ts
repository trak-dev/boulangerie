import express, {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { tokenVerification } from './middlewares/token-verification.guard';

import userRouter from './routes/users';
import { z } from 'zod';

const app = express();
const port = 8080;
const tokenLessPaths = ['/users/login', '/users/register'];
const mongoUrl = 'mongodb://127.0.0.1:27017/yummy-yams';

app.use(bodyParser.json());

app.use((req, res, next) => {
    // unless paths
    if (tokenLessPaths.includes(req.path)) {
        return next();
    }
    // verify if token is valid
    tokenVerification(req, res, next);
});

app.use('/users', userRouter);

// error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    // only send error message if it is a string
    if (typeof err === 'string') {
        return res.status(500).send(err);
    } else if (err instanceof z.ZodError) {
        return res.status(400).send(err.errors);
    } else {
        return res.status(500).send('Oops! Something went wrong!');
    }
});

mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error(err);
    });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});