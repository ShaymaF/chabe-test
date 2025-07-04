import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { missionRouter } from './api/missions/mission.router';
import { errorHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/logger.middleware';
import { logger } from './utils/logger';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'; 
import { authRouter } from './api/auth/auth.router';
import { systemRouter } from './api/system/system.router';
const swaggerDocument = YAML.load('./openapi.yaml');


const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());
app.use(loggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get('/compte-rendu', (req, res) => {
//     const compteRenduHtml = ``;
//     res.status(200).send(compteRenduHtml);
//   });
// app.get('/', (req, res) => {
//     const htmlResponse = '';
//     res.status(200).send(htmlResponse);
//   });

app.use('/api', missionRouter);
app.use('/api', authRouter); 
app.use('/api/system', systemRouter); 

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
    logger.info(`API documentation available at http://localhost:${port}/api-docs`);
  });
}

export default app;