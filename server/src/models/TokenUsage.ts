import { pool } from '../config/database';
import { TokenUsage, CreateTokenUsageDto } from '@ai-monitoring/shared';

export class TokenUsageModel {
  static async create(data: CreateTokenUsageDto): Promise<TokenUsage> {
    const query = `
      INSERT INTO token_usage (session_id, model, input_tokens, output_tokens, cost)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.session_id,
      data.model,
      data.input_tokens,
      data.output_tokens,
      data.cost
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findBySession(sessionId: string): Promise<TokenUsage[]> {
    const query = `
      SELECT * FROM token_usage
      WHERE session_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [sessionId]);
    return result.rows;
  }

  static async findByDateRange(startDate: Date, endDate: Date): Promise<TokenUsage[]> {
    const query = `
      SELECT * FROM token_usage
      WHERE created_at BETWEEN $1 AND $2
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  static async getDailyStats(date?: Date) {
    const targetDate = date || new Date();
    const query = `
      SELECT
        model,
        COUNT(*) as request_count,
        SUM(input_tokens) as total_input_tokens,
        SUM(output_tokens) as total_output_tokens,
        SUM(total_tokens) as total_tokens,
        SUM(cost) as total_cost
      FROM token_usage
      WHERE DATE(created_at) = DATE($1)
      GROUP BY model
    `;

    const result = await pool.query(query, [targetDate]);
    return result.rows;
  }

  static async getMonthlyStats(year: number, month: number) {
    const query = `
      SELECT
        model,
        COUNT(*) as request_count,
        SUM(input_tokens) as total_input_tokens,
        SUM(output_tokens) as total_output_tokens,
        SUM(total_tokens) as total_tokens,
        SUM(cost) as total_cost
      FROM token_usage
      WHERE EXTRACT(YEAR FROM created_at) = $1
        AND EXTRACT(MONTH FROM created_at) = $2
      GROUP BY model
    `;

    const result = await pool.query(query, [year, month]);
    return result.rows;
  }

  static async getSessionSummary(sessionId: string) {
    const query = `
      SELECT * FROM session_summaries
      WHERE session_id = $1
    `;

    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
  }

  static async getRecentSessions(limit: number = 10) {
    const query = `
      SELECT * FROM session_summaries
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}
