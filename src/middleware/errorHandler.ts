import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && err.error && err.error.isJoi) {
    const message = err.error.details.map((d: any) => d.message).join(', ');
    logger.warn(`Validation Error: ${message} on ${req.originalUrl}`);
    return res.status(400).json({
      type: err.type,
      message: message,
    });
  }
  
  logger.error(err.message, { stack: err.stack, url: req.originalUrl });
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
  });
};