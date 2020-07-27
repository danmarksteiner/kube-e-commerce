import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../middlewares/validate-request';

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
  (req: Request, res: Response) => {}
);

export { router as signinRouter };
