import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';

const router = express.Router();

router.post(
  '/api/users/signup',
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
      console.log('Email in use');
      // Return early
      return res.send({});
    }

    // Build a new user using the function defined in the User model
    const user = User.build({ email, password });
    // Persist the new user to mongoDb
    await user.save();

    // Respond with a 201 created code and send the user back
    res.status(201).send(user);
  }
);

export { router as signupRouter };
