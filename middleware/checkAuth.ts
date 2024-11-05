
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userTypes'
/*
FIX ME (types) 😭
*/
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

export const ensureAdminAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Cast req.user to the User type (or undefined if not set), so TypeScript recognizes it as a User object.
  // This allows us to access properties like 'role' on req.user without TypeScript errors.
  // If req.user is undefined (e.g., if the user is not authenticated), user will also be undefined.
  const user = req.user as User | undefined;

  // Check if the user is authenticated and has the 'admin' role
  if (req.isAuthenticated() && user?.role === 'admin') {
    return next(); // Allow access if authenticated and has admin role
  }

  // Redirect or send a 403 Forbidden response if not authorized
  res.status(403).send('Access denied: You don not have admin permissions to view this page.');
}

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}
