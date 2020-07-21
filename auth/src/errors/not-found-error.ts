import { CustomError } from './custom-error';

// Subclass extends custom error to ensure we include the right variables and methods in our error response
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found');
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}
