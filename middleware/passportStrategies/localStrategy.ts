import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById} from "../../controllers/userController";
import { PassportStrategy } from '../../interfaces/index';
// import { User } from "../../models/userTypes";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const result = getUserByEmailIdAndPassword(email, password);

    // If there's an error (wrong email or password), return the corresponding message
    if (result.error) {
      return done(null, false, { message: result.error });
    }

    // If user is found, create the session
    return done(null, result.user);
    // return user
    //   ? done(null, user) // create session and redirect to dashboard
    //   : done(null, false, { // do not create session and do not redirect to dashboard
    //       message: "Your login details are not valid. Please try again",
    //     });
  }
);

/*
FIX ME (types) still need to fix user😭
*/
// what data store inside the session and create session + create speciak variable req.user
passport.serializeUser(function (user: Express.User, done: (err: any, id?: string) => void) {
  done(null, user.id);
});

/*
FIX ME (types)😭
*/
// keep user uptudate
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
