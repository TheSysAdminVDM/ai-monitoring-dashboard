import { pool } from '../config/database';
import { ApiKey, CreateApiKeyDto } from '@ai-monitoring/shared';
import bcrypt from 'bcryptjs';

export class ApiKeyModel {
  static async create(data: CreateApiKeyDto): Promise<ApiKey> {
    const keyHash = await bcrypt.hash(data.key, 10);

    const query = `
      INSERT INTO api_keys (name, key_hash, provider, daily_limit, monthly_limit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, key_hash, provider, daily_limit, monthly_limit, created_at
    `;

    const values = [
      data.name,
      keyHash,
      data.provider,
      data.daily_limit || null,
      data.monthly_limit || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<ApiKey[]> {
    const query = `
      SELECT id, name, key_hash, provider, daily_limit, monthly_limit, is_active, created_at
      FROM api_keys
      WHERE is_active = true
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<ApiKey | null> {
    const query = `
      SELECT id, name, key_hash, provider, daily_limit, monthly_limit, is_active, created_at
      FROM api_keys
      WHERE id = $1 AND is_active = true
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByProvider(provider: string): Promise<ApiKey[]> {
    const query = `
      SELECT id, name, key_hash, provider, daily_limit, monthly_limit, is_active, created_at
      FROM api_keys
      WHERE provider = $1 AND is_active = true
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [provider]);
    return result.rows;
  }

  static async update(id: string, data: Partial<CreateApiKeyDto>): Promise<ApiKey> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name) {
      updates.push(`name = $${paramCount++}`);
      values.push(data.name);
    }

    if (data.daily_limit !== undefined) {
      updates.push(`daily_limit = $${paramCount++}`);
      values.push(data.daily_limit);
    }

    if (data.monthly_limit !== undefined) {
      updates.push(`monthly_limit = $${paramCount++}`);
      values.push(data.monthly_limit);
    }

    values.push(id);

    const query = `
      UPDATE api_keys
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, key_hash, provider, daily_limit, monthly_limit, created_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id: string): Promise<void> {
    const query = `
      UPDATE api_keys
      SET is_active = false
      WHERE id = $1
    `;

    await pool.query(query, [id]);
  }

  static async verifyKey(providedKey: string, keyHash: string): Promise<boolean> {
    return bcrypt.compare(providedKey, keyHash);
  }
}
