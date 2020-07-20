import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

// Error handler middleware
// Identifies the type of error set by the extended subclasses of Error potentionally thrown in the signup process
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log('Handling this as a request validation error');
  }

  if (err instanceof DatabaseConnectionError) {
    console.log('Handling this as a db connection error');
  }

  res.status(400).send({
    message: err.message,
  });
};
