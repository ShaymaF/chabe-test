import { Router } from 'express';
import { missionController } from './mission.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { createValidator } from 'express-joi-validation';
import { getMissionsQuerySchema, createMissionBodySchema } from './mission.validators';

const router = Router();
const validator = createValidator({ passError: true });

router.get(
  '/missions',
  authMiddleware,
  validator.query(getMissionsQuerySchema),
  missionController.getAllMissions
);

router.post(
  '/mission',
  authMiddleware,
  validator.body(createMissionBodySchema),
  missionController.createMission
);

export { router as missionRouter };