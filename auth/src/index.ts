import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
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
    // Require that cookies only be used over https
    secure: true,
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

const start = async () => {
  // Check for environment variable, we don't want to run unless this is defined in the pod
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    // Connect to cluster IP service as the domain - taken from name of service in auth-mongo-depl.yaml
    // Create auth database if it doesn't exist
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      // Configuration
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');
  } catch (err) {
    // Capture error if there is one
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!');
  });
};

// Run start
start();
