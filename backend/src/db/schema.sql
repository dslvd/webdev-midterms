CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('DEVELOPER', 'LEAD'))
);

CREATE TABLE IF NOT EXISTS microservices (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 3 AND 60),
  endpoint_url TEXT NOT NULL,
  environment TEXT NOT NULL CHECK (environment IN ('DEVELOPMENT', 'STAGING', 'PRODUCTION')),
  status TEXT NOT NULL CHECK (status IN ('HEALTHY', 'DEGRADED', 'DOWN')),
  version TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
