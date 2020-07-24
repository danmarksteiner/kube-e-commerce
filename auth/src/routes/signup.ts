import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  // Validate the request using express-validator middleware
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    // Query User collection and check if the email is already in use
    // Destructure email and password from the request
    const { email, password } = req.body;

    // Check against user collection
    const existingUser = await User.findOne({ email });

    // If email is in use
    if (existingUser) {
      throw new BadRequestError('Email is in use');
    }

    // Build a new user using the function defined in the User model
    const user = User.build({ email, password });
    // Persist the new user to mongoDb
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
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
    res.status(201).send(user);
  }
);

export { router as signupRouter };
