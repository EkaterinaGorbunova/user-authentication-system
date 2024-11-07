"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByEmailIdAndPassword = void 0;
const userModel_1 = require("../models/userModel");
const getUserByEmailIdAndPassword = (email, password) => {
    let user = userModel_1.userModel.findOne(email);
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
exports.getUserByEmailIdAndPassword = getUserByEmailIdAndPassword;
const getUserById = (id) => {
    let user = userModel_1.userModel.findById(id);
    return user ? user : null;
};
exports.getUserById = getUserById;
function isUserValid(user, password) {
    return user.password === password;
}
