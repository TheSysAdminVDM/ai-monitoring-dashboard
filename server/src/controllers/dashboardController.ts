import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  static async getMetrics(req: Request, res: Response) {
    try {
      const sessionId = req.query.sessionId as string | undefined;
      const metrics = await DashboardService.getDashboardMetrics(sessionId);

      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard metrics'
      });
    }
  }

  static async getUsageStats(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const stats = await DashboardService.getUsageStats(days);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch usage statistics'
      });
    }
  }

  static async getModelBreakdown(req: Request, res: Response) {
    try {
      const breakdown = await DashboardService.getModelBreakdown();

      res.json({
        success: true,
        data: breakdown
      });
    } catch (error) {
      console.error('Error fetching model breakdown:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch model breakdown'
      });
    }
  }

  static async getHourlyUsage(req: Request, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const hourlyData = await DashboardService.getHourlyUsage(date);

      res.json({
        success: true,
        data: hourlyData
      });
    } catch (error) {
      console.error('Error fetching hourly usage:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch hourly usage'
      });
    }
  }
}
