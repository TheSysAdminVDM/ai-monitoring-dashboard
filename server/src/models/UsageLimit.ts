import { pool } from '../config/database';
import { UsageLimit, CreateUsageLimitDto } from '@ai-monitoring/shared';

export class UsageLimitModel {
  static async create(data: CreateUsageLimitDto): Promise<UsageLimit> {
    const query = `
      INSERT INTO usage_limits (limit_type, limit_value, alert_threshold)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [data.limit_type, data.limit_value, data.alert_threshold];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<UsageLimit[]> {
    const query = `
      SELECT * FROM usage_limits
      WHERE is_active = true
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async findByType(limitType: 'daily' | 'monthly' | 'session'): Promise<UsageLimit | null> {
    const query = `
      SELECT * FROM usage_limits
      WHERE limit_type = $1 AND is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [limitType]);
    return result.rows[0] || null;
  }

  static async update(id: string, data: Partial<CreateUsageLimitDto>): Promise<UsageLimit> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.limit_value !== undefined) {
      updates.push(`limit_value = $${paramCount++}`);
      values.push(data.limit_value);
    }

    if (data.alert_threshold !== undefined) {
      updates.push(`alert_threshold = $${paramCount++}`);
      values.push(data.alert_threshold);
    }

    values.push(id);

    const query = `
      UPDATE usage_limits
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: string): Promise<void> {
    const query = `
      UPDATE usage_limits
      SET is_active = false
      WHERE id = $1
    `;

    await pool.query(query, [id]);
  }
}
