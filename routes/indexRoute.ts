import express from 'express';
import {
  ensureAuthenticated,
  ensureAdminAuthenticated,
} from '../middleware/checkAuth';
import { setBaseUrl } from '../middleware/setBaseUrl';
// import { User } from '../models/userTypes'

const router = express.Router();
router.use(setBaseUrl);

router.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
    baseUrl: req.baseUrl,
  });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.user,
  });
});

router.get('/admin', ensureAdminAuthenticated, (req, res) => {  
  const sessions = (req.sessionStore as any).sessions;

  const userSessions = Object.entries(sessions).map(([sessionId, sessionData]) => {
    const session = JSON.parse(sessionData as string);
    return {
      sessionId,
      userId: session.passport?.user || null, // Ensure that if no user ID is found, we explicitly set it to null
    };
  }).filter(session => session.userId !== (req.user as Express.User)?.id); // Exclude the admin session from the list of сurrent active sessions

  res.render('admin', {
    user: req.user,
    baseUrl: req.baseUrl,
    sessions: userSessions,
  });
});

export default router;
