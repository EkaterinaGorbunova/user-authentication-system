import express from 'express';
import {
  ensureAuthenticated,
  ensureAdminAuthenticated,
} from '../middleware/checkAuth';
import { setBaseUrl } from '../middleware/setBaseUrl';

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
  res.render('admin', {
    user: req.user,
    baseUrl: req.baseUrl,
  });
});

export default router;
