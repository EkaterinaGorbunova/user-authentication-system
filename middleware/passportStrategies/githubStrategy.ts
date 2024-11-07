import { Strategy as GitHubStrategy } from 'passport-github2';
import { Profile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { userModel } from '../../models/userModel';

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!githubClientID || !githubClientSecret) {
  throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be defined in the environment variables');
}

// Get the user's email from GitHub profile (https://stackoverflow.com/questions/35373995/github-user-email-is-null-despite-useremail-scope)
async function getUserEmail(profile: Profile, accessToken: string) {
  // Check if the profile contains any emails. If so, use the first one.
  // If the profile has no emails, the value of email will be set to null.
  let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
  // If no email is found in the profile, make an API call to GitHub to fetch the user's email
  if (!email) {
    // Make a GET request to GitHub's /user/emails API endpoint using the access token
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` }, // Include the access token in the request headers
    });
    // Find the primary email from the response data (email with primary: true)
    const primaryEmail = emailResponse.data.find((emailObj: { primary: boolean }) => emailObj.primary);
    // If a primary email is found, use it; otherwise, set email to null
    email = primaryEmail?.email || null;
    // Log the fetched email to the console for debugging purposes
    console.log('Fetched email:', email);
  }
  return email;
}

function createUser(profile: Profile, email: string): Express.User {
  return {
    id: String(userModel.database.length + 1), // Generate user id
    name: profile.displayName || profile.username || "Unknown Username",
    email: email,
    password: '', // 'password' not applicable for GitHub users
    role: 'user', // All users have the  role: 'user' by default
  };
}

/* FIX ME 😭*/
async function handleGitHubAuthentication(req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: Express.User | null) => void) {
  try {
    const email = await getUserEmail(profile, accessToken);
    
    if (!email) {
      return done(new Error("No email associated with this account"), null);
    }

    // Check if the user already exists in the database 
    const existingUser = userModel.findOne(email);
    if (existingUser) {
      return done(null, existingUser);
    }

    // If user does not exist, create a new user and push it to database array
    const newUser: Express.User = createUser(profile, email);
    userModel.database.push(newUser);

    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}

const githubStrategy: GitHubStrategy = new GitHubStrategy(
  {
    clientID: githubClientID,
    clientSecret: githubClientSecret,
    callbackURL: "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
  },
  
  handleGitHubAuthentication
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
