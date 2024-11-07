import { Request, Response, NextFunction } from 'express';

export const setBaseUrl = (req: Request, res: Response, next: NextFunction) => {
  // Get the base URL from the request headers
  req.baseUrl = `${req.protocol}://${req.get('host')}`;
  console.log('req.baseUrl1:', req.baseUrl)
  next();
};