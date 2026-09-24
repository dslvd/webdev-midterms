import { pool } from '../db/pool';
import type { User, Microservice } from '../types';

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'DEVELOPER' | 'LEAD';
}

interface ServiceRow {
  id: number;
  name: string;
  endpoint_url: string;
  environment: Microservice['environment'];
  status: Microservice['status'];
  version: string;
  owner_email: string;
  created_at: Date;
}

function toUser(row: UserRow): User {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
  };
}

function toService(row: ServiceRow): Microservice {
  return {
    id: String(row.id),
    name: row.name,
    endpointUrl: row.endpoint_url,
    environment: row.environment,
    status: row.status,
    version: row.version,
    ownerEmail: row.owner_email,
    createdAt: row.created_at.toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const { rows } = await pool.query<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] ? toUser(rows[0]) : null;
}

export async function listServices(): Promise<Microservice[]> {
  const { rows } = await pool.query<ServiceRow>('SELECT * FROM microservices ORDER BY id');
  return rows.map(toService);
}

export async function createService(input: {
  name: string;
  endpointUrl: string;
  environment: Microservice['environment'];
  status: Microservice['status'];
  version: string;
  ownerEmail: string;
}): Promise<Microservice> {
  const { rows } = await pool.query<ServiceRow>(
    `INSERT INTO microservices (name, endpoint_url, environment, status, version, owner_email)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [input.name, input.endpointUrl, input.environment, input.status, input.version, input.ownerEmail]
  );
  return toService(rows[0]);
}

export async function updateService(
  id: string,
  updates: Partial<{
    name: string;
    endpointUrl: string;
    environment: Microservice['environment'];
    status: Microservice['status'];
    version: string;
  }>
): Promise<Microservice | null> {
  const columns: Record<string, string> = {
    name: 'name',
    endpointUrl: 'endpoint_url',
    environment: 'environment',
    status: 'status',
    version: 'version',
  };

  const sets: string[] = [];
  const values: unknown[] = [];

  for (const [key, column] of Object.entries(columns)) {
    const value = (updates as Record<string, unknown>)[key];
    if (value !== undefined) {
      values.push(value);
      sets.push(`${column} = $${values.length}`);
    }
  }

  if (sets.length === 0) {
    const { rows } = await pool.query<ServiceRow>('SELECT * FROM microservices WHERE id = $1', [id]);
    return rows[0] ? toService(rows[0]) : null;
  }

  values.push(id);
  const { rows } = await pool.query<ServiceRow>(
    `UPDATE microservices SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] ? toService(rows[0]) : null;
}

export async function deleteService(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM microservices WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
