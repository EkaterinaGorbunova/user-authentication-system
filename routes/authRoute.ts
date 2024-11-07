import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 failureMsg needed when login fails */
    // https://stackoverflow.com/questions/26403853/node-js-authentication-with-passport-how-to-flash-a-message-if-a-field-is-missi
    failureFlash: true // Enable failure message storage
  })
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback", passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true, // Enable failure message storage
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
