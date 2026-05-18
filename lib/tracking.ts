import { neon } from '@neondatabase/serverless';

async function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

async function ensureTables() {
  const sql = await getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_tracking_users (
      user_id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS skinalyze_tracking_events (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      event TEXT,
      session_id TEXT,
      timestamp TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function trackEvent(userId: string, event: string, sessionId: string) {
  await ensureTables();
  const sql = await getDb();
  // Upsert user
  await sql`
    INSERT INTO skinalyze_tracking_users (user_id)
    VALUES (${userId})
    ON CONFLICT (user_id) DO NOTHING
  `;
  // Insert event
  await sql`
    INSERT INTO skinalyze_tracking_events (user_id, event, session_id)
    VALUES (${userId}, ${event}, ${sessionId})
  `;
}

export async function getStats() {
  await ensureTables();
  const sql = await getDb();
  const [usersRow] = await sql`SELECT COUNT(*) AS count FROM skinalyze_tracking_users`;
  const [eventsRow] = await sql`SELECT COUNT(*) AS count FROM skinalyze_tracking_events`;
  const eventBreakdown = await sql`
    SELECT event, COUNT(*) AS count
    FROM skinalyze_tracking_events
    GROUP BY event
    ORDER BY count DESC
  `;
  return {
    total_users: Number(usersRow.count),
    total_events: Number(eventsRow.count),
    breakdown: eventBreakdown,
  };
}
