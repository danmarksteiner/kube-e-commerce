import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Defines what a User payload should be to help add a definition of currentUser to the request
interface UserPayload {
  id: string;
  email: string;
}

// Reaches into existing request interface definition and adds something to it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If there is no session object or jwt property
  if (!req.session?.jwt) {
    // Return early and move on to next middleware
    return next();
  }

  // Try/Catch for any potential error thrown by jwt.verify
  try {
    // Decode and extract information to verify on the JWT on the request
    // Compare against the JWT key env variable
    const payload = jwt.verify(
      // Provided JWT
      req.session.jwt,
      // Secret key - Ignored in TS due to check on index.ts
      process.env.JWT_KEY!
    ) as UserPayload;

    // Augumented req with optional currentUser property from the declaration at the top
    req.currentUser = payload;
  } catch (err) {}

  // Continue to next middleware
  next();
};
