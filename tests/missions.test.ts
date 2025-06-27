import request from 'supertest';
import app from '../src/index';
import jwt from 'jsonwebtoken';
import { gdsService } from '../src/services/GdsService';

// Mocker le module du service GDS
jest.mock('../src/services/GdsService');

const mockedGdsService = gdsService as jest.Mocked<typeof gdsService>;

describe('Missions API', () => {
  let token: string;

  beforeAll(() => {
    token = jwt.sign({ user: 'test' }, process.env.API_CLIENT_SECRET!);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/missions', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const res = await request(app).get('/api/missions');
      expect(res.statusCode).toEqual(401);
    });

    it('should return a list of missions by calling GdsService.getRessource', async () => {
      const mockApiResponse = { C_Gen_Mission: [{ MIS_ID: '1234' }] };
      mockedGdsService.getRessource.mockResolvedValue(mockApiResponse);

      const res = await request(app)
        .get('/api/missions')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockApiResponse);
      expect(mockedGdsService.getRessource).toHaveBeenCalledTimes(1);
      
   
      const expectedParams = { C_Gen_Mission: {} };
      expect(mockedGdsService.getRessource).toHaveBeenCalledWith(expectedParams);
    });

    it('should pass filter parameters to GdsService.getRessource', async () => {
      mockedGdsService.getRessource.mockResolvedValue({ C_Gen_Mission: [] });

      await request(app)
        .get('/api/missions?MIS_DATE_DEBUT%23MIN=2024-01-01')
        .set('Authorization', `Bearer ${token}`);
      
    
      const expectedParams = {
        C_Gen_Mission: {
          'MIS_DATE_DEBUT#MIN': expect.any(Date) 
        }
      };
      expect(mockedGdsService.getRessource).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('POST /api/mission', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
        const res = await request(app).post('/api/mission').send({});
        expect(res.statusCode).toEqual(401);
    });

    it('should return 400 Bad Request if payload is invalid', async () => {
        const invalidPayload = { MIS_TSE_ID: "SERVICE-01" };
        
        const res = await request(app)
            .post('/api/mission')
            .set('Authorization', `Bearer ${token}`)
            .send(invalidPayload);

        expect(res.statusCode).toEqual(400);
        expect(mockedGdsService.setRessourceV2).not.toHaveBeenCalled();
    });

    it('should create a new mission by calling GdsService.setRessourceV2', async () => {
        const newMissionPayload = {
            "MIS_DATE_DEBUT": "2024-05-20",
            "MIS_TSE_ID": "SERVICE-01",
            "MIS_TVE_ID": "VEHICLE-05"
        };
        
        const mockApiResponse = {
            C_Gen_Mission: [{ ...newMissionPayload, MIS_ID: 'GDS-NEW-ID-54321' }]
        };
        mockedGdsService.setRessourceV2.mockResolvedValue(mockApiResponse);

        const res = await request(app)
            .post('/api/mission')
            .set('Authorization', `Bearer ${token}`)
            .send(newMissionPayload);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(mockApiResponse);
        expect(mockedGdsService.setRessourceV2).toHaveBeenCalledTimes(1);

       
        const expectedParams = {
            C_Gen_Mission: [
                {
                    ...newMissionPayload,
                    MIS_DATE_DEBUT: expect.any(Date) 
                }
            ]
        };
        expect(mockedGdsService.setRessourceV2).toHaveBeenCalledWith(expectedParams);
    });
  });
});