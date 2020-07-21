import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());

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
