import express from 'express';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

// Current user checks if a current valid JWT is set and the user should be considered logged in
router.get('/api/users/currentuser', currentUser, (req, res) => {
  // Send back the current user in an object or null to avoid undefined
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
