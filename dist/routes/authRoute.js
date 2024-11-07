"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
router.get("/login", checkAuth_1.forwardAuthenticated, (req, res) => {
    res.render("login");
});
router.post("/login", passport_1.default.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    /* FIX ME: 😭 failureMsg needed when login fails */
    // https://stackoverflow.com/questions/26403853/node-js-authentication-with-passport-how-to-flash-a-message-if-a-field-is-missi
    failureFlash: true // Enable failure message storage
}));
router.get("/github", passport_1.default.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport_1.default.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true, // Enable failure message storage
}));
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err)
            console.log(err);
    });
    res.redirect("/auth/login");
});
exports.default = router;
