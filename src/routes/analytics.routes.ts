import { Router } from 'express';
import * as AnalyticsController from '../controllers/analytics.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/live', protect, AnalyticsController.getStats);

router.get('/overview', protect, AnalyticsController.getOverview);

export default router;
