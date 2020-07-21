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
    // Array of objects returned to errors object on the errors property
    // Makes use of the serialize errors function declared in the error file to return a consistant errors object
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  if (err instanceof DatabaseConnectionError) {
    // Returns an array of objects with the reason field from the database connection error
    // Makes use of the serialize errors function declared in the error file to return a consistant errors object
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    // Generic error formatted as an array of objects with a message property
    // Only shown after passing other errors and is used as a fallback
    errors: [{ message: 'Something went wrong' }],
  });
};
