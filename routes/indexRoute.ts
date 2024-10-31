import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", (req, res) => {
  // Get the base URL from the request headers
  const baseUrl = `${req.protocol}://${req.get('host')}`
  res.render('index', { baseUrl });
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

export default router;
