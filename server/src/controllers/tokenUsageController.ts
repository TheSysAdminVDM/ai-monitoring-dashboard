import { Request, Response } from 'express';
import { TokenUsageModel } from '../models/TokenUsage';
import { CreateTokenUsageDto } from '@ai-monitoring/shared';

export class TokenUsageController {
  static async create(req: Request, res: Response) {
    try {
      const data: CreateTokenUsageDto = req.body;
      const tokenUsage = await TokenUsageModel.create(data);

      res.status(201).json({
        success: true,
        data: tokenUsage
      });
    } catch (error) {
      console.error('Error creating token usage:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create token usage record'
      });
    }
  }

  static async getBySession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const tokenUsage = await TokenUsageModel.findBySession(sessionId);

      res.json({
        success: true,
        data: tokenUsage
      });
    } catch (error) {
      console.error('Error fetching token usage:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch token usage'
      });
    }
  }

  static async getDailyStats(req: Request, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const stats = await TokenUsageModel.getDailyStats(date);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch daily statistics'
      });
    }
  }

  static async getMonthlyStats(req: Request, res: Response) {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

      const stats = await TokenUsageModel.getMonthlyStats(year, month);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch monthly statistics'
      });
    }
  }

  static async getSessionSummary(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const summary = await TokenUsageModel.getSessionSummary(sessionId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Error fetching session summary:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch session summary'
      });
    }
  }

  static async getRecentSessions(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const sessions = await TokenUsageModel.getRecentSessions(limit);

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recent sessions'
      });
    }
  }
}
