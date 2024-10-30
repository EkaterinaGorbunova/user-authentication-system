import { Strategy as GitHubStrategy } from 'passport-github2';
import { Profile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const githubClientID = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!githubClientID || !githubClientSecret) {
  throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be defined in the environment variables');
}

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: githubClientID,
        clientSecret: githubClientSecret,
        callbackURL: "http://127.0.0.1:8000/auth/github/callback",
        passReqToCallback: true,
    },
    
    /* FIX ME 😭 still need to fix any in done*/
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: any) => {

    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
