import {userModel} from "../models/userModel";

const getUserByEmailIdAndPassword = (email: string, password: string) => {
  let user = userModel.findOne(email);

    // If the user doesn't exist
  if (!user) {
    return { error: `Couldn't find user with email: ${email}` };
  }

  // If the password is incorrect
  if (!isUserValid(user, password)) {
    return { error: "Password is incorrect. Try again" };
  }

  return { user };
};

const getUserById = (id:string) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user: Express.User, password: string) {
  return user.password === password;
}

export {
  getUserByEmailIdAndPassword,
  getUserById,
};
