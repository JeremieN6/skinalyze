import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer style={{ background: '#1C2420', padding: '4rem 2rem 2.5rem', color: 'rgba(255,255,255,0.7)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4rem', alignItems: 'start', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg fill="none" height="20" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 8v4l3 3" />
                  <circle cx="18" cy="6" fill="white" r="3" stroke="none" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 600, color: 'white' }}>Skinalyze</span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: 320, margin: '0 0 1.5rem' }}>
              En 60 secondes, chaque client repart avec un diagnostic peau personnalisé.
            </p>
            <a href="mailto:contact@skinalyze.fr" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#8B9E6Ecc', textDecoration: 'none', borderBottom: '1px solid #8B9E6E40', paddingBottom: 1 }}>
              contact@skinalyze.fr
            </a>
          </div>

          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem' }}>Produit</h4>
              {[
                { href: '/diagnostic', label: 'Tester gratuitement' },
                { href: '/#tarifs', label: 'Tarifs' },
                { href: '/blog', label: 'Blog' },
                { href: 'mailto:contact@skinalyze.fr', label: 'Contact' },
              ].map((l) => (
                <div key={l.href} style={{ marginBottom: '0.6rem' }}>
                  <Link href={l.href} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{l.label}</Link>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem' }}>Légal</h4>
              {[
                { href: '/cgu', label: 'CGU' },
                { href: '/privacy', label: 'Politique de confidentialité' },
              ].map((l) => (
                <div key={l.href} style={{ marginBottom: '0.6rem' }}>
                  <Link href={l.href} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{l.label}</Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span suppressHydrationWarning style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}>© {new Date().getFullYear()} Skinalyze — Tous droits réservés</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#8B9E6E80' }}>Propulsé par Skinalyze</span>
        </div>
      </div>
    </footer>
  );
}
