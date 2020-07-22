// Abstract class defines Custom error so that we can extend our errors and makke sure we impliment them correctly
export abstract class CustomError extends Error {
  abstract statusCode: number;

  // Message passed in for logging purposes
  constructor(message: string) {
    // Equivalent to calling new Error()
    super(message);
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
