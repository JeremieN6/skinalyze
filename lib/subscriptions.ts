import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';

async function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured');
  return neon(databaseUrl);
}

async function ensureTables() {
  const sql = await getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_users (
      user_id TEXT PRIMARY KEY,
      email TEXT,
      stripe_customer_id TEXT,
      plan TEXT DEFAULT 'free',
      plan_status TEXT DEFAULT 'inactive',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE skinalyze_users ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP`;
  await sql`ALTER TABLE skinalyze_users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP`;

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS skinalyze_users_email_unique_idx
    ON skinalyze_users (LOWER(email))
    WHERE email IS NOT NULL AND email <> ''
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_customers (
      id SERIAL PRIMARY KEY,
      stripe_customer_id TEXT UNIQUE,
      email TEXT,
      plan TEXT,
      plan_status TEXT,
      user_id TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_diagnostics_usage (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function getUser(userId: string) {
  await ensureTables();
  const sql = await getDb();
  const rows = await sql`SELECT * FROM skinalyze_users WHERE user_id = ${userId} LIMIT 1`;
  return rows[0];
}

export async function getUserByEmail(email: string) {
  await ensureTables();
  const sql = await getDb();
  const rows = await sql`
    SELECT *
    FROM skinalyze_users
    WHERE lower(email) = lower(${email})
    ORDER BY updated_at DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getOrCreateUser(userId: string, email?: string) {
  await ensureTables();
  const sql = await getDb();
  await sql`
    INSERT INTO skinalyze_users (user_id, email)
    VALUES (${userId}, ${email ?? ''})
    ON CONFLICT (user_id) DO UPDATE
    SET email = COALESCE(NULLIF(${email ?? ''}, ''), skinalyze_users.email), updated_at = NOW()
  `;
  const [row] = await sql`SELECT * FROM skinalyze_users WHERE user_id = ${userId} LIMIT 1`;
  return row;
}

export async function getOrCreateUserByEmail(email: string) {
  await ensureTables();
  const sql = await getDb();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await sql`
    SELECT *
    FROM skinalyze_users
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;

  if (existing[0]) {
    return existing[0];
  }

  const userId = randomUUID();
  await sql`
    INSERT INTO skinalyze_users (user_id, email)
    VALUES (${userId}, ${normalizedEmail})
  `;
  const [row] = await sql`SELECT * FROM skinalyze_users WHERE user_id = ${userId} LIMIT 1`;
  return row;
}

export async function upsertCustomerFromStripe(stripeCustomerId: string, email?: string, plan?: string, plan_status?: string) {
  await ensureTables();
  const sql = await getDb();
  const normalizedEmail = (email ?? '').trim().toLowerCase();
  await sql`
    INSERT INTO skinalyze_customers (stripe_customer_id, email, plan, plan_status)
    VALUES (${stripeCustomerId}, ${normalizedEmail}, ${plan ?? 'starter'}, ${plan_status ?? 'active'})
    ON CONFLICT (stripe_customer_id) DO UPDATE
    SET email = COALESCE(NULLIF(${normalizedEmail}, ''), skinalyze_customers.email),
        plan = ${plan ?? 'starter'},
        plan_status = ${plan_status ?? 'active'},
        updated_at = NOW()
  `;
  await sql`
    UPDATE skinalyze_users
    SET
      stripe_customer_id = ${stripeCustomerId},
      plan = ${plan ?? 'starter'},
      plan_status = ${plan_status ?? 'active'},
      updated_at = NOW()
    WHERE stripe_customer_id = ${stripeCustomerId}
  `;
  if (normalizedEmail) {
    await sql`
      UPDATE skinalyze_users
      SET
        stripe_customer_id = ${stripeCustomerId},
        plan = ${plan ?? 'starter'},
        plan_status = ${plan_status ?? 'active'},
        updated_at = NOW()
      WHERE LOWER(email) = ${normalizedEmail}
    `;
  }
  const [row] = await sql`SELECT * FROM skinalyze_customers WHERE stripe_customer_id = ${stripeCustomerId} LIMIT 1`;
  return row;
}

export async function linkCustomerToUser(stripeCustomerId: string, userId: string) {
  await ensureTables();
  const sql = await getDb();
  await sql`UPDATE skinalyze_customers SET user_id = ${userId}, updated_at = NOW() WHERE stripe_customer_id = ${stripeCustomerId}`;
  await sql`
    UPDATE skinalyze_users
    SET
      stripe_customer_id = ${stripeCustomerId},
      plan = COALESCE((SELECT plan FROM skinalyze_customers WHERE stripe_customer_id = ${stripeCustomerId}), skinalyze_users.plan),
      plan_status = COALESCE((SELECT plan_status FROM skinalyze_customers WHERE stripe_customer_id = ${stripeCustomerId}), skinalyze_users.plan_status),
      updated_at = NOW()
    WHERE user_id = ${userId}
  `;
  const [row] = await sql`SELECT * FROM skinalyze_customers WHERE stripe_customer_id = ${stripeCustomerId} LIMIT 1`;
  return row;
}

export async function getUserByStripeCustomer(stripeCustomerId: string) {
  await ensureTables();
  const sql = await getDb();
  const [row] = await sql`SELECT * FROM skinalyze_customers WHERE stripe_customer_id = ${stripeCustomerId} LIMIT 1`;
  return row;
}

export async function getLatestCustomerByEmail(email: string) {
  await ensureTables();
  const sql = await getDb();
  const rows = await sql`
    SELECT *
    FROM skinalyze_customers
    WHERE lower(email) = lower(${email})
    ORDER BY updated_at DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getMonthlyUsage(userId: string) {
  await ensureTables();
  const sql = await getDb();
  const [row] = await sql`SELECT COUNT(*)::int AS count FROM skinalyze_diagnostics_usage WHERE user_id = ${userId} AND created_at >= date_trunc('month', now())`;
  return Number(row?.count ?? 0);
}

export async function tryReserveDiagnostic(userId: string, quota: number) {
  await ensureTables();
  const sql = await getDb();
  const rows = await sql`
    WITH used AS (
      SELECT COUNT(*)::int AS count FROM skinalyze_diagnostics_usage
      WHERE user_id = ${userId} AND created_at >= date_trunc('month', now())
    ), ins AS (
      INSERT INTO skinalyze_diagnostics_usage (user_id)
      SELECT ${userId}
      WHERE (SELECT count FROM used) < ${quota}
      RETURNING id
    )
    SELECT (SELECT count FROM used) AS used, (SELECT id FROM ins) AS inserted_id
  `;
  return rows[0] ?? { used: 0, inserted_id: null };
}

export async function cancelReservation(id: number) {
  if (!id) return;
  const sql = await getDb();
  await sql`DELETE FROM skinalyze_diagnostics_usage WHERE id = ${id}`;
}

export async function recordUsage(userId: string) {
  await ensureTables();
  const sql = await getDb();
  const [row] = await sql`INSERT INTO skinalyze_diagnostics_usage (user_id) VALUES (${userId}) RETURNING id`;
  return row;
}

export async function activateTrial(userId: string) {
  await ensureTables();
  const sql = await getDb();
  await sql`
    UPDATE skinalyze_users
    SET plan = 'trial',
        plan_status = 'active',
        trial_started_at = NOW(),
        trial_ends_at = NOW() + INTERVAL '14 days',
        updated_at = NOW()
    WHERE user_id = ${userId}
  `;
  const [row] = await sql`SELECT * FROM skinalyze_users WHERE user_id = ${userId} LIMIT 1`;
  return row;
}

export async function getTrialsExpiringToday() {
  await ensureTables();
  const sql = await getDb();
  return sql`
    SELECT user_id, email, trial_ends_at
    FROM skinalyze_users
    WHERE plan = 'trial'
      AND plan_status = 'active'
      AND trial_ends_at::date = CURRENT_DATE
  `;
}

export async function expireTrials() {
  await ensureTables();
  const sql = await getDb();
  await sql`
    UPDATE skinalyze_users
    SET plan = 'free', plan_status = 'expired', updated_at = NOW()
    WHERE plan = 'trial' AND plan_status = 'active' AND trial_ends_at < NOW()
  `;
}

export async function getQuotaAndRemaining(userId: string) {
  await ensureTables();
  const sql = await getDb();
  const [user] = await sql`SELECT plan, plan_status, trial_ends_at FROM skinalyze_users WHERE user_id = ${userId} LIMIT 1`;
  let plan = user?.plan ?? 'free';

  // Auto-expire trial if past end date
  if (plan === 'trial' && user?.trial_ends_at && new Date(user.trial_ends_at) < new Date()) {
    await sql`UPDATE skinalyze_users SET plan = 'free', plan_status = 'expired', updated_at = NOW() WHERE user_id = ${userId}`;
    plan = 'free';
  }

  let quota: number | -1;
  if (plan === 'pro') quota = parseInt(process.env.PRO_MONTHLY_QUOTA ?? '150', 10);
  else if (plan === 'starter') quota = parseInt(process.env.STARTER_MONTHLY_QUOTA ?? '50', 10);
  else if (plan === 'trial') quota = -1; // diagnostics illimités pendant l'essai
  else quota = parseInt(process.env.FREE_MONTHLY_QUOTA ?? '3', 10);
  const [usedRow] = await sql`SELECT COUNT(*)::int AS count FROM skinalyze_diagnostics_usage WHERE user_id = ${userId} AND created_at >= date_trunc('month', now())`;
  const used = Number(usedRow?.count ?? 0);
  const remaining = quota === -1 ? -1 : Math.max(0, quota - used);
  return { plan, quota, used, remaining };
}

export default {};
