import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

// Middlware checks the incoming request for any errors thrown from express validator and then responds by throwing the requestvalidation custom error
// If no errors are present manually call next on the request
// Abstracted to middleware so this can be used in all routes
export const validateRequest = (
  // 3 arguments given to denote a regular middleware to express
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check incoming request for errors
  const errors = validationResult(req);
  // Throw new validation error is errors are present
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  // Manually call next
  next();
};
