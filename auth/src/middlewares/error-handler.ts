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
    // Take the errors array from express-validator and return a formatted object for each error
    const formattedErrors = err.errors.map(error => {
      return { message: error.msg, field: error.param };
    });
    // Array of objects returned to errors object on the errors property
    return res.status(400).send({ errors: formattedErrors });
  }

  if (err instanceof DatabaseConnectionError) {
    // Returns an array of objects with the reason field from the database connection error
    return res.status(500).send({ errors: [{ message: err.reason }] });
  }

  res.status(400).send({
    // Generic error formatted as an array of objects with a message property
    // Only shown after passing other errors and is used as a fallback
    errors: [{ message: 'Something went wrong' }],
  });
};
