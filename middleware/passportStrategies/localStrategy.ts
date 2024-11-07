import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const result = getUserByEmailIdAndPassword(email, password);

    // If there's an error (wrong email or password), return the corresponding message
    // https://stackoverflow.com/questions/26403853/node-js-authentication-with-passport-how-to-flash-a-message-if-a-field-is-missi
    if (result.error) {
      return done(null, false, { message: result.error });
    }

    return done(null, result.user);
  }
);

/*
FIX ME (types) still need to fix user😭
*/
// Decide what data to store in the session; create session and req.user
passport.serializeUser(function (user: Express.User, done: (err: any, id?: string) => void) {
  done(null, user.id);
});

/*
FIX ME (types)😭
*/
// Keep user data up-to-date on each request
passport.deserializeUser(function (id: string, done: (err: any, user?: Express.User | false | null) => void) {
  let user = getUserById(id);
  if (user) {
    done(null, user); // refresh data and attach it to req.user 
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: 'local',
  strategy: localStrategy,
};

export default passportLocalStrategy;
