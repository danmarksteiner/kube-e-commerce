import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// For TS declare the signin helper onto the global object and define it's return value
declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

// Define mongo ahead of time so we can access it in multiple hook functions
let mongo: any;

// Create new instance of mongo in memory
// Stops multiple services from potentially reaching out to the same copy of mongo
// Also grants direct access to the database for easier testing
// Hook function will run before all tests
beforeAll(async () => {
  // Manually set environment variable to be available for testing
  process.env.JWT_KEY = 'asdf';

  // Setup in memory mongoDb
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Hook function will run before each tests
beforeEach(async () => {
  // Delete all data in between each test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Hook function will run after all tests to shut down in memory mongoDb
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Signin helper function to allow authenticated requests with a cookie easily
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
