import express from 'express';

const router = express.Router();

// Route to destroy a session by session id
router.get('/sessions/:sessionId/destroy', (req, res) => {
  const sessionId = req.params.sessionId;

  req.sessionStore.destroy(sessionId, (err) => {
    if (err) console.log(err);
    res.redirect('/admin');
  });
});

export default router;
