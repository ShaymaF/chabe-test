import { Request, Response, NextFunction } from 'express';
import { missionService } from './mission.service';

class MissionController {
  public async getAllMissions(req: Request, res: Response, next: NextFunction) {
    try {
      const missions = await missionService.findAll(req.query);
      res.status(200).json(missions);
    } catch (error) {
      next(error);
    }
  }

  public async createMission(req: Request, res: Response, next: NextFunction) {
    try {
      const newMission = await missionService.create(req.body);
      res.status(201).json(newMission);
    } catch (error) {
      next(error);
    }
  }
}

export const missionController = new MissionController();