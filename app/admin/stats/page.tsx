import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getStats } from '@/lib/tracking';

export default async function AdminStatsPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin');

  type Stats = { total_users: number; total_events: number; breakdown: { event: string; count: string | number }[] };
  let stats: Stats | null = null;
  let err = '';
  try {
    stats = await getStats() as Stats;
  } catch {
    err = 'Erreur de connexion à la base de données.';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F4', padding: '3rem 2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1C2420', margin: '0 0 0.25rem' }}>Statistiques</h1>
            <p style={{ fontSize: '0.85rem', color: '#7A8876', margin: 0 }}>Dashboard Skinalyze</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href="/admin/leads" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#8B9E6E', textDecoration: 'none', padding: '0.6rem 1.25rem', borderRadius: 50, border: '1.5px solid #8B9E6E50' }}>Leads</a>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 500, color: '#7A8876', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Déconnexion</button>
            </form>
          </div>
        </div>

        {err ? (
          <p style={{ color: '#DC2626' }}>{err}</p>
        ) : stats ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Utilisateurs uniques', value: stats.total_users },
                { label: 'Événements trackés', value: stats.total_events },
              ].map((s) => (
                <div key={s.label} style={{ background: '#FFFFFF', borderRadius: 20, padding: '1.75rem', border: '1px solid #E8E4DC', boxShadow: '0 2px 10px rgba(28,36,32,0.05)' }}>
                  <div style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#8B9E6E', marginBottom: '0.5rem' }}>{s.value}</div>
                  <div style={{ fontSize: '0.85rem', color: '#7A8876', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '1.75rem', border: '1px solid #E8E4DC' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600, color: '#1C2420', margin: '0 0 1.25rem' }}>Détail des événements</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E8E4DC' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#7A8876', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Événement</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem 0.75rem', color: '#7A8876', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.08em' }}>Occurrences</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.breakdown.map((row) => (
                    <tr key={row.event} style={{ borderBottom: '1px solid #F0EDE8' }}>
                      <td style={{ padding: '0.75rem', color: '#3D4A3A', fontFamily: 'monospace', fontSize: '0.82rem' }}>{row.event}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#1C2420', fontWeight: 600 }}>{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
