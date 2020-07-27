import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Current user checks if a current valid JWT is set and the user should be considered logged in
router.get('/api/users/currentuser', (req, res) => {
  // Check both the existance of session and JWT on the session object for TS
  if (!req.session?.jwt) {
    // Return early with false on currentUser
    return res.send({ currentUser: null });
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
    );
    // If sucessful return current user with the payload
    res.send({ currentUser: payload });
  } catch (err) {
    // Set false on currentUser if error is caught
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
