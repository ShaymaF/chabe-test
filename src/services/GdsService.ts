import { createHmac } from 'crypto';
import axios from 'axios';
import { logger } from '../utils/logger';

const GDS_API_BASE_URL = process.env.GDS_API_URL!; // https://api.waynium.com/gdsv3
const GDS_API_KEY = process.env.GDS_API_KEY!;
const GDS_SECRET_KEY = process.env.GDS_SECRET_KEY!;

if (!GDS_API_BASE_URL || !GDS_API_KEY || !GDS_SECRET_KEY) {
  throw new Error('Les variables d\'environnement GDS (URL, KEY, SECRET) ne sont pas configurées !');
}

//https://waynium.atlassian.net/wiki/external/OTRjNDk3ZTM0ZmZjNDlhYjk2ODcxYTRlODdjZjMzNTk#Available-Endpoints

class GdsService {

  // creer manuellement le token JWT non standard
  private Base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private createJWT(payload: object): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
      apiKey: GDS_API_KEY,
      time: Math.floor(Date.now() / 1000).toString(),
    };
    const encodedHeader = this.Base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.Base64UrlEncode(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = createHmac('sha256', GDS_SECRET_KEY)
      .update(signatureInput)
      .digest('base64');
    const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return `${signatureInput}.${encodedSignature}`;
  }
  
  /**
   * Méthode générique pour envoyer la requête POST à une URL GDS spécifique.
   * @param endpoint Le chemin spécifique de l'endpoint (ex: 'get-ressource').
   * @param gdsParams Les paramètres de la commande GDS.
   */
  private async callGdsApi(endpoint: string, gdsParams: object): Promise<any> {
    const fullUrl = `${GDS_API_BASE_URL}/${endpoint}`;
    logger.info(`[GDS Client] Préparation de l'appel vers l'URL : ${fullUrl}`);

    const fullPayload = [{
      limo: GDS_API_KEY,
      params: gdsParams
    }];
    
    const token = this.createJWT(fullPayload);
    logger.info('[GDS Client] JWT généré.');

    try {
      const response = await axios.post(fullUrl, token, {
        headers: { 'Content-Type': 'application/jwt' },
      });
      logger.info(`[GDS Client] Réponse reçue avec succès de ${fullUrl}.`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`[GDS Client] Erreur Axios sur ${fullUrl}: ${error.message}`);
        if (error.response) {
          logger.error(`[GDS Client] Statut de la réponse : ${error.response.status}`);
          logger.error(`[GDS Client] Données de la réponse : ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(`Échec de la communication avec GDS : ${error.response?.data?.message || error.message}`);
      }
      logger.error(`[GDS Client] Erreur inattendue : ${error}`);
      throw new Error('Une erreur inattendue est survenue lors du contact avec le service GDS.');
    }
  }


   //  'get-ressource' 
  public async getRessource(params: any): Promise<any> {
    return this.callGdsApi('get-ressource', params);
  }

 // 'set-ressource-v2'
  public async setRessourceV2(params: any): Promise<any> {
    return this.callGdsApi('set-ressource-v2', params);
  }

 /// set-callback
  public async setCallback(params: any): Promise<any> {
    return this.callGdsApi('set-callback', params);
  }
}

export const gdsService = new GdsService();