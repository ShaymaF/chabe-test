import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const API_CLIENT_SECRET = process.env.API_CLIENT_SECRET || "chabe";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, API_CLIENT_SECRET);
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};