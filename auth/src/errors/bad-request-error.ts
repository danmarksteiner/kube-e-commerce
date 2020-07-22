import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode = 400;

  // Take the message passed in
  constructor(public message: string) {
    super(message);
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    // Return an array of objects with the passed in message
    return [{ message: this.message }];
  }
}
