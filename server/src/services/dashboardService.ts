import { pool } from '../config/database';
import { DashboardMetrics } from '@ai-monitoring/shared';
import { UsageLimitModel } from '../models/UsageLimit';

export class DashboardService {
  static async getDashboardMetrics(sessionId?: string): Promise<DashboardMetrics> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get daily usage
    const dailyQuery = `
      SELECT
        COALESCE(SUM(total_tokens), 0) as total_tokens,
        COALESCE(SUM(cost), 0) as total_cost
      FROM token_usage
      WHERE created_at >= $1
    `;
    const dailyResult = await pool.query(dailyQuery, [today]);

    // Get monthly usage
    const monthlyQuery = `
      SELECT
        COALESCE(SUM(total_tokens), 0) as total_tokens,
        COALESCE(SUM(cost), 0) as total_cost
      FROM token_usage
      WHERE created_at >= $1
    `;
    const monthlyResult = await pool.query(monthlyQuery, [monthStart]);

    // Get session usage if sessionId provided
    let sessionTokens = 0;
    if (sessionId) {
      const sessionQuery = `
        SELECT COALESCE(SUM(total_tokens), 0) as total_tokens
        FROM token_usage
        WHERE session_id = $1
      `;
      const sessionResult = await pool.query(sessionQuery, [sessionId]);
      sessionTokens = parseInt(sessionResult.rows[0].total_tokens);
    }

    // Get limits
    const dailyLimit = await UsageLimitModel.findByType('daily');
    const monthlyLimit = await UsageLimitModel.findByType('monthly');

    const dailyTokens = parseInt(dailyResult.rows[0].total_tokens);
    const monthlyTokens = parseInt(monthlyResult.rows[0].total_tokens);
    const dailyCost = parseFloat(dailyResult.rows[0].total_cost);
    const monthlyCost = parseFloat(monthlyResult.rows[0].total_cost);

    // Calculate alert status
    let alertStatus: 'safe' | 'warning' | 'critical' = 'safe';

    if (dailyLimit) {
      const dailyPercentage = (dailyTokens / dailyLimit.limit_value) * 100;
      if (dailyPercentage >= dailyLimit.alert_threshold) {
        alertStatus = dailyPercentage >= 95 ? 'critical' : 'warning';
      }
    }

    if (monthlyLimit && alertStatus === 'safe') {
      const monthlyPercentage = (monthlyTokens / monthlyLimit.limit_value) * 100;
      if (monthlyPercentage >= monthlyLimit.alert_threshold) {
        alertStatus = monthlyPercentage >= 95 ? 'critical' : 'warning';
      }
    }

    return {
      current_session_tokens: sessionTokens,
      daily_tokens: dailyTokens,
      monthly_tokens: monthlyTokens,
      daily_cost: dailyCost,
      monthly_cost: monthlyCost,
      daily_limit: dailyLimit?.limit_value,
      monthly_limit: monthlyLimit?.limit_value,
      alert_status: alertStatus
    };
  }

  static async getUsageStats(days: number = 7) {
    const query = `
      SELECT
        DATE(created_at) as date,
        model,
        SUM(total_tokens) as tokens,
        SUM(cost) as cost,
        COUNT(*) as requests
      FROM token_usage
      WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(created_at), model
      ORDER BY date DESC, model
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async getModelBreakdown() {
    const query = `
      SELECT
        model,
        COUNT(*) as request_count,
        SUM(total_tokens) as total_tokens,
        SUM(cost) as total_cost,
        AVG(cost) as avg_cost
      FROM token_usage
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY model
      ORDER BY total_cost DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async getHourlyUsage(date?: Date) {
    const targetDate = date || new Date();
    const query = `
      SELECT
        EXTRACT(HOUR FROM created_at) as hour,
        SUM(total_tokens) as tokens,
        SUM(cost) as cost,
        COUNT(*) as requests
      FROM token_usage
      WHERE DATE(created_at) = DATE($1)
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `;

    const result = await pool.query(query, [targetDate]);
    return result.rows;
  }
}
