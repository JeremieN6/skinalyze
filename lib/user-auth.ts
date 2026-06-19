import { neon } from '@neondatabase/serverless';
import { createHash, randomInt, randomUUID } from 'crypto';
import type { NextRequest } from 'next/server';
import { getOrCreateUserByEmail } from '@/lib/subscriptions';

export const AUTH_COOKIE_NAME = 'skinalyze_uid';
const CODE_TTL_MINUTES = 15;

async function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured');
  return neon(databaseUrl);
}

function hashCode(code: string) {
  return createHash('sha256').update(code).digest('hex');
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createOtpCode() {
  return String(randomInt(0, 1000000)).padStart(6, '0');
}

async function ensureAuthTables() {
  const sql = await getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_auth_codes (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS skinalyze_auth_codes_email_idx
    ON skinalyze_auth_codes (LOWER(email), created_at DESC)
  `;
}

export async function createAuthCode(email: string) {
  await ensureAuthTables();
  const normalizedEmail = normalizeEmail(email);
  const user = await getOrCreateUserByEmail(normalizedEmail);
  const code = createOtpCode();
  const sql = await getDb();

  await sql`
    INSERT INTO skinalyze_auth_codes (user_id, email, code_hash, expires_at)
    VALUES (
      ${user.user_id},
      ${normalizedEmail},
      ${hashCode(code)},
      NOW() + (${CODE_TTL_MINUTES} * INTERVAL '1 minute')
    )
  `;

  return { code, userId: user.user_id, email: normalizedEmail };
}

export async function verifyAuthCode(email: string, code: string) {
  await ensureAuthTables();
  const normalizedEmail = normalizeEmail(email);
  const hashed = hashCode(code.trim());
  const sql = await getDb();

  const rows = await sql`
    SELECT id, user_id
    FROM skinalyze_auth_codes
    WHERE LOWER(email) = ${normalizedEmail}
      AND code_hash = ${hashed}
      AND used_at IS NULL
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const hit = rows[0];
  if (!hit) return null;

  await sql`UPDATE skinalyze_auth_codes SET used_at = NOW() WHERE id = ${hit.id}`;
  return { userId: hit.user_id as string, email: normalizedEmail };
}

export function getAuthUserIdFromRequest(req: NextRequest) {
  return req.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}

const MAGIC_TOKEN_TTL_DAYS = 7;

async function ensureMagicTokensTable() {
  const sql = await getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_magic_tokens (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function createMagicToken(email: string): Promise<string> {
  await ensureMagicTokensTable();
  const normalizedEmail = normalizeEmail(email);
  const user = await getOrCreateUserByEmail(normalizedEmail);
  const token = randomUUID();
  const sql = await getDb();
  await sql`
    INSERT INTO skinalyze_magic_tokens (user_id, email, token, expires_at)
    VALUES (
      ${user.user_id},
      ${normalizedEmail},
      ${token},
      NOW() + (${MAGIC_TOKEN_TTL_DAYS} * INTERVAL '1 day')
    )
  `;
  return token;
}

export async function verifyMagicToken(token: string): Promise<{ userId: string; email: string } | null> {
  await ensureMagicTokensTable();
  const sql = await getDb();
  const rows = await sql`
    SELECT id, user_id, email
    FROM skinalyze_magic_tokens
    WHERE token = ${token}
      AND used_at IS NULL
      AND expires_at > NOW()
    LIMIT 1
  `;
  const hit = rows[0];
  if (!hit) return null;
  await sql`UPDATE skinalyze_magic_tokens SET used_at = NOW() WHERE id = ${hit.id}`;
  return { userId: hit.user_id as string, email: hit.email as string };
}
