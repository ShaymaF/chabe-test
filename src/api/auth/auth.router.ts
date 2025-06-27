import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.get(
  '/generate-test-token',
  authController.getTestToken
);

export { router as authRouter };