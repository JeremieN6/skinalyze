import { neon } from '@neondatabase/serverless';

async function getDb() {
  return neon(process.env.DATABASE_URL!);
}

async function ensureTable() {
  const sql = await getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      company TEXT,
      structure_type TEXT,
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function saveLead(data: {
  name: string;
  email: string;
  company: string;
  structure_type: string;
  message?: string;
}) {
  await ensureTable();
  const sql = await getDb();
  await sql`
    INSERT INTO leads (name, email, company, structure_type, message)
    VALUES (${data.name}, ${data.email}, ${data.company}, ${data.structure_type}, ${data.message ?? ''})
  `;
}

export async function getLeads() {
  await ensureTable();
  const sql = await getDb();
  return sql`SELECT * FROM leads ORDER BY created_at DESC`;
}
