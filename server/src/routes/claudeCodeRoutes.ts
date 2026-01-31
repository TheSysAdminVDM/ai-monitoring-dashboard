import { Router } from 'express';
import { ClaudeCodeController } from '../controllers/claudeCodeController';

const router = Router();

// Get dashboard metrics from Claude Code stats
router.get('/stats', ClaudeCodeController.getStats);

// Get daily activity data
router.get('/daily', ClaudeCodeController.getDailyActivity);

// Get daily model token usage
router.get('/daily-tokens', ClaudeCodeController.getDailyTokens);

// Get raw Claude Code stats
router.get('/raw', ClaudeCodeController.getRawStats);

// Get file information (for debugging)
router.get('/file-info', ClaudeCodeController.getFileInfo);

export default router;
