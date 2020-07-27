import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    // Validate the incoming request
    // Check for a valid email
    body('email').isEmail().withMessage('Email must be valid'),
    // Check password
    body('password')
      // Trim spaces
      .trim()
      // Check a password is provided
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  // Validate Request Middleware to check for errors
  validateRequest,
  async (req: Request, res: Response) => {
    // Pull email and password from the request
    const { email, password } = req.body;

    // Find any user email which will match the user submitted in the request
    const existingUser = await User.findOne({ email });

    // If we can't find a matching user return a bad request error
    // We return as little information as possible for security
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    // Compare the passwords with the compare method from the password service
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    // If the password supplied doesn't match the stored password return a bad request error
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      // Encode with our JWT_KEY secret defined as an env variable
      // Disable TS checking on the environment variable as this is defined in index.ts
      process.env.JWT_KEY!
    );

    // Set it on the session object
    req.session = {
      jwt: userJwt,
    };

    // Respond with a 201 created code and send the user back
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
