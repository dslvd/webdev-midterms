import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { pool } from './pool';

export async function initDb(): Promise<void> {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  await pool.query(schema);

  const { rows: userRows } = await pool.query('SELECT COUNT(*) FROM users');
  if (Number(userRows[0].count) === 0) {
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['Agent One', 'agent1@gmail.com', bcrypt.hashSync('password123', 10), 'DEVELOPER']
    );
  }

  const { rows: serviceRows } = await pool.query('SELECT COUNT(*) FROM microservices');
  if (Number(serviceRows[0].count) === 0) {
    await pool.query(
      `INSERT INTO microservices (name, endpoint_url, environment, status, version, owner_email)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['TEST', 'https://example.com/health', 'PRODUCTION', 'HEALTHY', '1.0.0', 'agent1@gmail.com'],
    );
  }
}
