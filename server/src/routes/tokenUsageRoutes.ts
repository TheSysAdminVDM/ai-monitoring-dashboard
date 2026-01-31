import { Router } from 'express';
import { TokenUsageController } from '../controllers/tokenUsageController';
import { validateTokenUsage } from '../middleware/validation';

const router = Router();

router.post('/', validateTokenUsage, TokenUsageController.create);
router.get('/session/:sessionId', TokenUsageController.getBySession);
router.get('/daily-stats', TokenUsageController.getDailyStats);
router.get('/monthly-stats', TokenUsageController.getMonthlyStats);
router.get('/session-summary/:sessionId', TokenUsageController.getSessionSummary);
router.get('/recent-sessions', TokenUsageController.getRecentSessions);

export default router;
