// src/api/auth/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

class AuthController {
  public getTestToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = authService.generateTestToken();
      res.status(200).json({
        message: 'Use this token to access protected endpoints.',
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();