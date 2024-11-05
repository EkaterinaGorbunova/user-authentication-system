"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forwardAuthenticated = exports.ensureAdminAuthenticated = exports.ensureAuthenticated = void 0;
/*
FIX ME (types) 😭
*/
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
};
exports.ensureAuthenticated = ensureAuthenticated;
const ensureAdminAuthenticated = (req, res, next) => {
    // Cast req.user to the User type (or undefined if not set), so TypeScript recognizes it as a User object.
    // This allows us to access properties like 'role' on req.user without TypeScript errors.
    // If req.user is undefined (e.g., if the user is not authenticated), user will also be undefined.
    const user = req.user;
    // Check if the user is authenticated and has the 'admin' role
    if (req.isAuthenticated() && (user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        return next(); // Allow access if authenticated and has admin role
    }
    // Redirect or send a 403 Forbidden response if not authorized
    res.status(403).send('Access denied: You don not have admin permissions to view this page.');
};
exports.ensureAdminAuthenticated = ensureAdminAuthenticated;
/*
FIX ME (types) 😭
*/
const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/dashboard");
};
exports.forwardAuthenticated = forwardAuthenticated;
