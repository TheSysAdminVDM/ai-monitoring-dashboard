import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from '../config/database';

async function runMigration() {
  console.log('Starting database migration...');

  try {
    const migrationPath = join(__dirname, '../../../database/migrations/001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    await pool.query(migrationSQL);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
