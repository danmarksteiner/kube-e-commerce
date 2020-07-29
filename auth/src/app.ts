import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

// Trust the connection so that express is aware of the ingress-nginx proxy
app.set('trust proxy', true);

// Body parser json middleware
app.use(json());

// Cookie Session Middleware
app.use(
  cookieSession({
    // Disable encryption as JWT is already tamper proof
    // This will also improve compatability with other languages if needed in the future
    signed: false,
    // Reads environmment variable to set secure to true if not in a test environment
    secure: process.env.NODE_ENV !== 'test',
  })
);

// Setup our API routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// If not a designated route throw a new not found 404 error
app.all('*', async () => {
  throw new NotFoundError();
});

// Include our error handling middleware
app.use(errorHandler);

export { app };
