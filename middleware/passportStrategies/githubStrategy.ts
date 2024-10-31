import { Strategy as GitHubStrategy } from 'passport-github2';
import { Profile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { userModel } from '../../models/userModel';
import { User } from '../../models/userTypes'

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!githubClientID || !githubClientSecret) {
  throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be defined in the environment variables');
}

// Function to get user email from GitHub
async function getUserEmail(profile: Profile, accessToken: string) {
  console.log('GitHub profile:', profile)
  // Check if profile.emails is defined and has at least one email
  let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null; 

  if (!email) {
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const primaryEmail = emailResponse.data.find((emailObj: { primary: boolean }) => emailObj.primary);
    email = primaryEmail?.email || null;
    console.log('Fetched email:', email);
  }

  return email;
}

// Function to create a new user object
function createUser(profile: Profile, email: string): User {
  return {
    id: String(userModel.database.length + 1), // Generate user id
    name: profile.displayName || profile.username || "Unknown User",
    email: email,
    password: '', // Password not applicable for GitHub users
  };
}

// Function to handle GitHub authentication logic
/* FIX ME 😭*/
async function handleGitHubAuthentication(req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: User | null) => void) {
  try {
    const email = await getUserEmail(profile, accessToken);
    
    if (!email) {
      return done(new Error("No email associated with this account"), null);
    }

    // Check if the user already exists in the database by email
    const existingUser = userModel.findOne(email);
    if (existingUser) {
      return done(null, existingUser);
    }

    // If user does not exist, create a new user
    const newUser: User = createUser(profile, email);
    userModel.database.push(newUser); // Add new user to database

    console.log('Updated userModel.database:', userModel.database);
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
