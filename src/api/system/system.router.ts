import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { gdsService } from '../../services/GdsService';
import { logger } from '../../utils/logger';

const router = Router();

/**
 * @route POST /api/system/set-callback
 * @description Sets the callback URL in the GDS system.
 * @access Protected
 */
router.post('/set-callback', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'The "url" field is required in the request body.' });
    }

    try {
      logger.info(`[API] Received request to set GDS callback URL to: ${url}`);
      const gdsResponse = await gdsService.setCallback(url);
      res.status(200).json({ message: 'GDS callback URL successfully configured.', gdsResponse });
    } catch (error) {
      next(error);
    }
  }
);

export { router as systemRouter };