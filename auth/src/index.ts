import mongoose from 'mongoose';

import { app } from './app';

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
