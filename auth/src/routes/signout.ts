import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  // Clear out the cookie on the session object
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
