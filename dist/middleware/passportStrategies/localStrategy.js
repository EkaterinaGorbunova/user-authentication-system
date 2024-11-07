"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userController_1 = require("../../controllers/userController");
const localStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => {
    const result = (0, userController_1.getUserByEmailIdAndPassword)(email, password);
    // If there's an error (wrong email or password), return the corresponding message
    // https://stackoverflow.com/questions/26403853/node-js-authentication-with-passport-how-to-flash-a-message-if-a-field-is-missi
    if (result.error) {
        return done(null, false, { message: result.error });
    }
    return done(null, result.user);
});
/*
FIX ME (types) still need to fix user😭
*/
// Decide what data to store in the session; create session and req.user
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
/*
FIX ME (types)😭
*/
// Keep user data up-to-date on each request
passport_1.default.deserializeUser(function (id, done) {
    let user = (0, userController_1.getUserById)(id);
    if (user) {
        done(null, user); // refresh data and attach it to req.user 
    }
    else {
        done({ message: "User not found" }, null);
    }
});
const passportLocalStrategy = {
    name: 'local',
    strategy: localStrategy,
};
exports.default = passportLocalStrategy;
