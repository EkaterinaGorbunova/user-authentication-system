"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_github2_1 = require("passport-github2");
const userModel_1 = require("../../models/userModel");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
if (!githubClientID || !githubClientSecret) {
    throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be defined in the environment variables');
}
// Function to get user email from GitHub
function getUserEmail(profile, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('GitHub profile:', profile);
        // Check if profile.emails is defined and has at least one email
        let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!email) {
            const emailResponse = yield axios_1.default.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const primaryEmail = emailResponse.data.find((emailObj) => emailObj.primary);
            email = (primaryEmail === null || primaryEmail === void 0 ? void 0 : primaryEmail.email) || null;
            console.log('Fetched email:', email);
        }
        return email;
    });
}
// Function to create a new user object
function createUser(profile, email) {
    return {
        id: String(userModel_1.userModel.database.length + 1), // Generate user id
        name: profile.displayName || profile.username || "Unknown User",
        email: email,
        password: '', // Password not applicable for GitHub users
    };
}
// Function to handle GitHub authentication logic
/* FIX ME 😭*/
function handleGitHubAuthentication(req, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = yield getUserEmail(profile, accessToken);
            if (!email) {
                return done(new Error("No email associated with this account"), null);
            }
            // Check if the user already exists in the database by email
            const existingUser = userModel_1.userModel.findOne(email);
            if (existingUser) {
                return done(null, existingUser);
            }
            // If user does not exist, create a new user
            const newUser = createUser(profile, email);
            userModel_1.userModel.database.push(newUser); // Add new user to database
            console.log('Updated userModel.database:', userModel_1.userModel.database);
            return done(null, newUser);
        }
        catch (error) {
            return done(error, null);
        }
    });
}
const githubStrategy = new passport_github2_1.Strategy({
    clientID: githubClientID,
    clientSecret: githubClientSecret,
    callbackURL: "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
}, handleGitHubAuthentication);
const passportGitHubStrategy = {
    name: 'github',
    strategy: githubStrategy,
};
exports.default = passportGitHubStrategy;
