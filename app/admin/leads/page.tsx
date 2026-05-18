import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getLeads } from '@/lib/leads';

export default async function AdminLeadsPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let leads: any[] = [];
  let err = '';
  try {
    leads = await getLeads() as typeof leads;
  } catch {
    err = 'Erreur de connexion à la base de données.';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F4', padding: '3rem 2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1C2420', margin: '0 0 0.25rem' }}>Leads</h1>
            <p style={{ fontSize: '0.85rem', color: '#7A8876', margin: 0 }}>{leads.length} contact{leads.length !== 1 ? 's' : ''} enregistré{leads.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href="/admin/stats" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#8B9E6E', textDecoration: 'none', padding: '0.6rem 1.25rem', borderRadius: 50, border: '1.5px solid #8B9E6E50' }}>Stats</a>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 500, color: '#7A8876', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Déconnexion</button>
            </form>
          </div>
        </div>

        {err ? (
          <p style={{ color: '#DC2626' }}>{err}</p>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#7A8876' }}>Aucun lead pour l&apos;instant.</div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E8E4DC', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#FAFAF7', borderBottom: '2px solid #E8E4DC' }}>
                  {['Nom', 'Email', 'Entreprise', 'Type', 'Message', 'Date'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', color: '#7A8876', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={lead.id ?? i} style={{ borderBottom: '1px solid #F0EDE8' }}>
                    <td style={{ padding: '0.875rem 1rem', color: '#1C2420', fontWeight: 600 }}>{lead.name}</td>
                    <td style={{ padding: '0.875rem 1rem' }}><a href={`mailto:${lead.email}`} style={{ color: '#8B9E6E', textDecoration: 'none' }}>{lead.email}</a></td>
                    <td style={{ padding: '0.875rem 1rem', color: '#3D4A3A' }}>{lead.company}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#7A8876' }}>{lead.structure_type}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#7A8876', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.message}</td>
                    <td style={{ padding: '0.875rem 1rem', color: '#7A8876', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{lead.created_at ? new Date(lead.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
