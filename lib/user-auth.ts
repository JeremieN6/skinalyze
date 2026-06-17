import { neon } from '@neondatabase/serverless';
import { createHash, randomInt } from 'crypto';
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
import { cookies } from 'next/headers';
import { createHash, randomBytes, randomInt } from 'crypto';
import { neon } from '@neondatabase/serverless';

export const USER_AUTH_COOKIE = 'skinalyze_user_auth';

async function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured');
  return neon(databaseUrl);
}

async function ensureAuthTables() {
  const sql = await getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_auth_codes (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      consumed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_user_sessions (
      session_token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

export async function saveOtpCode(email: string, code: string) {
  await ensureAuthTables();
  const sql = await getDb();
  const codeHash = hashValue(code);
  await sql`
    INSERT INTO skinalyze_auth_codes (email, code_hash, expires_at)
    VALUES (${email.toLowerCase()}, ${codeHash}, NOW() + INTERVAL '15 minutes')
  `;
}

export async function verifyOtpCode(email: string, code: string) {
  await ensureAuthTables();
  const sql = await getDb();
  const emailNorm = email.toLowerCase();
  const codeHash = hashValue(code);
  const rows = await sql`
    SELECT id
    FROM skinalyze_auth_codes
    WHERE email = ${emailNorm}
      AND code_hash = ${codeHash}
      AND consumed_at IS NULL
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return false;
  await sql`UPDATE skinalyze_auth_codes SET consumed_at = NOW() WHERE id = ${row.id}`;
  return true;
}

export async function createUserSession(userId: string) {
  await ensureAuthTables();
  const sql = await getDb();
  const rawToken = randomBytes(32).toString('hex');
  const tokenHash = hashValue(rawToken);

  await sql`
    INSERT INTO skinalyze_user_sessions (session_token_hash, user_id, expires_at)
    VALUES (${tokenHash}, ${userId}, NOW() + INTERVAL '30 days')
  `;

  return rawToken;
}

export function getUserAuthCookieConfig(value: string) {
  return {
    name: USER_AUTH_COOKIE,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };
}

export async function clearUserSessionByToken(rawToken: string) {
  await ensureAuthTables();
  const sql = await getDb();
  const tokenHash = hashValue(rawToken);
  await sql`DELETE FROM skinalyze_user_sessions WHERE session_token_hash = ${tokenHash}`;
}

export async function getAuthenticatedUserIdFromCookie() {
  await ensureAuthTables();
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(USER_AUTH_COOKIE)?.value;
  if (!rawToken) return null;

  const sql = await getDb();
  const tokenHash = hashValue(rawToken);
  const rows = await sql`
    SELECT user_id
    FROM skinalyze_user_sessions
    WHERE session_token_hash = ${tokenHash}
      AND expires_at > NOW()
    LIMIT 1
  `;

  return rows[0]?.user_id ?? null;
}
