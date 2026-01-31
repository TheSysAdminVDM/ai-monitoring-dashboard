import { Request, Response } from 'express';
import { ClaudeCodeService } from '../services/claudeCodeService';

export class ClaudeCodeController {
  /**
   * Get dashboard metrics from Claude Code stats
   * GET /api/claude-code/stats
   */
  static async getStats(req: Request, res: Response) {
    try {
      const metrics = await ClaudeCodeService.getDashboardMetrics();

      if (!metrics) {
        return res.status(404).json({
          success: false,
          error: 'Claude Code stats file not found',
          message: 'Make sure Claude Code is installed and has been used at least once',
          fileInfo: await ClaudeCodeService.getFileInfo(),
        });
      }

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Error fetching Claude Code stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch Claude Code stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get daily activity data
   * GET /api/claude-code/daily
   * Query params: days (default: 7)
   */
  static async getDailyActivity(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;

      if (days < 1 || days > 365) {
        return res.status(400).json({
          success: false,
          error: 'Invalid days parameter',
          message: 'Days must be between 1 and 365',
        });
      }

      const activity = await ClaudeCodeService.getDailyActivity(days);

      res.json({
        success: true,
        data: activity,
      });
    } catch (error) {
      console.error('Error fetching daily activity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch daily activity',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get daily model token usage
   * GET /api/claude-code/daily-tokens
   * Query params: days (default: 7)
   */
  static async getDailyTokens(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;

      if (days < 1 || days > 365) {
        return res.status(400).json({
          success: false,
          error: 'Invalid days parameter',
          message: 'Days must be between 1 and 365',
        });
      }

      const tokens = await ClaudeCodeService.getDailyModelTokens(days);

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      console.error('Error fetching daily tokens:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch daily tokens',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get raw Claude Code stats
   * GET /api/claude-code/raw
   */
  static async getRawStats(req: Request, res: Response) {
    try {
      const stats = await ClaudeCodeService.readStats();

      if (!stats) {
        return res.status(404).json({
          success: false,
          error: 'Claude Code stats file not found',
          fileInfo: await ClaudeCodeService.getFileInfo(),
        });
      }

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching raw stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch raw stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get file information (for debugging)
   * GET /api/claude-code/file-info
   */
  static async getFileInfo(req: Request, res: Response) {
    try {
      const fileInfo = await ClaudeCodeService.getFileInfo();

      res.json({
        success: true,
        data: fileInfo,
      });
    } catch (error) {
      console.error('Error fetching file info:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch file info',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
