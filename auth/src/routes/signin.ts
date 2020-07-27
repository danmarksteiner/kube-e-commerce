import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { RequestValidationError } from '../errors/request-validation-error';

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
  (req: Request, res: Response) => {
    // Check if anything went wrong with the validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Throw new validation error and pass in the errors array
      throw new RequestValidationError(errors.array());
    }
  }
);

export { router as signinRouter };
