"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.database = void 0;
const database = [
    {
        id: '1',
        name: "Jimmy Smith",
        email: "jimmy123@gmail.com",
        password: "jimmy123!",
        role: 'user'
    },
    {
        id: '2',
        name: "Johnny Doe",
        email: "johnny123@gmail.com",
        password: "johnny123!",
        role: 'user'
    },
    {
        id: '3',
        name: "Jonathan Chen",
        email: "jonathan123@gmail.com",
        password: "jonathan123!",
        role: 'admin'
    },
    {
        id: '4',
        name: "Kate",
        email: "ekaterina.nalitova@gmail.com",
        password: "kate!",
        role: 'admin'
    },
];
exports.database = database;
const userModel = {
    database, // Expose the database array
    /* FIX ME (types) 😭 */
    findOne: (email) => {
        const user = database.find((user) => user.email === email);
        return user || null;
    },
    /* FIX ME (types) 😭 */
    findById: (id) => {
        const user = database.find((user) => user.id === id);
        if (user) {
            return user || null;
        }
        throw new Error(`Couldn't find user with id: ${id}`);
    },
};
exports.userModel = userModel;
