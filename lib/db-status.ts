import { neon } from '@neondatabase/serverless';

export type DatabaseHealth = {
  ok: boolean;
  label: string;
  details: string;
};

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return {
      ok: false,
      label: 'Hors ligne',
      details: 'DATABASE_URL est manquante dans les variables d environnement.',
    };
  }

  try {
    const sql = neon(databaseUrl);
    await sql`SELECT 1`;
    return {
      ok: true,
      label: 'En ligne',
      details: 'Connexion PostgreSQL active.',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return {
      ok: false,
      label: 'Hors ligne',
      details: `Connexion PostgreSQL impossible: ${message}`,
    };
  }
}
