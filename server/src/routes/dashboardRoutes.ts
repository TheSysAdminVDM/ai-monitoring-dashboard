import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();

router.get('/metrics', DashboardController.getMetrics);
router.get('/usage-stats', DashboardController.getUsageStats);
router.get('/model-breakdown', DashboardController.getModelBreakdown);
router.get('/hourly-usage', DashboardController.getHourlyUsage);

export default router;
