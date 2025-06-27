import { gdsService } from '../../services/GdsService';

class MissionService {
  public async findAll(query: any) {
    const params = { C_Gen_Mission: { ...query } };
    return gdsService.getRessource(params);
  }

  public async create(body: any) {
    const params = { C_Gen_Mission: [body] };
    return gdsService.setRessourceV2(params);
  }
}

export const missionService = new MissionService();