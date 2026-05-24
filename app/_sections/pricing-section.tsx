const STRIPE_STARTER = process.env.NEXT_PUBLIC_STRIPE_STARTER_LINK || 'https://buy.stripe.com/00weVe0v27uTbCWboTePi2c';
const STRIPE_PRO = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || 'https://buy.stripe.com/cNi9AU91y8yX36qakPePi2d';

const checkIcon = (
  <svg fill="none" height="16" stroke="#8B9E6E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="16">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function PricingSection() {
  return (
    <section id="tarifs" style={{ padding: '100px 2rem', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B9E6E', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1rem' }}>Tarifs</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>
            Investissement simple, <em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>retour immédiat</em>
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#7A8876', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Pas d&apos;engagement. Résiliez quand vous voulez.</p>
        </div>

        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 800, margin: '0 auto 3rem' }}>
          {/* Starter */}
          <div style={{ padding: '2.25rem', borderRadius: 24, background: '#FFFFFF', border: '2px solid #E8E4DC', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <div className="animate-badge-pulse" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'linear-gradient(135deg, #C4975A, #E8A87C)', borderRadius: 50, padding: '4px 10px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 800, color: 'white', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Prix lancement · 10 premiers clients</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}><span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#8B9E6E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Starter</span></div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '1.75rem', marginTop: '1rem' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, color: '#1C2420', lineHeight: 1 }}>59€</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#7A8876' }}>/mois</span>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              {['50 diagnostics / mois', 'Support email', 'Rapport PDF personnalisé', 'Accès sans installation'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                  {checkIcon}<span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#3D4A3A' }}>{f}</span>
                </div>
              ))}
            </div>
            <a href={STRIPE_STARTER} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', padding: '0.85rem 1.5rem', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 16px #8B9E6E40' }}>Commencer</a>
          </div>

          {/* Pro */}
          <div style={{ padding: '2.25rem', borderRadius: 24, background: 'linear-gradient(160deg, #6B7C54 0%, #1C2420 100%)', border: '2px solid #8B9E6E', boxShadow: '0 8px 30px #8B9E6E25', position: 'relative', overflow: 'hidden' }}>
            <div className="animate-badge-pulse" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'linear-gradient(135deg, #C4975A, #E8A87C)', borderRadius: 50, padding: '4px 10px' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 800, color: 'white', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Prix lancement · 10 premiers clients</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}><span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#8B9E6Ecc', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pro</span></div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '1.75rem', marginTop: '1rem' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>149€</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>/mois</span>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              {['150 diagnostics / mois', 'Support prioritaire', 'Rapports mensuels analytics', 'Rapport PDF personnalisé', 'Accès sans installation'].map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                  {checkIcon}<span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>{f}</span>
                </div>
              ))}
            </div>
            <a href={STRIPE_PRO} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: '#1C2420', background: 'white', padding: '0.85rem 1.5rem', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>Choisir Pro</a>
          </div>
        </div>

        {/* Business */}
        <div style={{ textAlign: 'center', padding: '2rem', background: '#FAFAF7', borderRadius: 20, maxWidth: 600, margin: '0 auto', border: '1px solid #E8E4DC' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#1C2420', margin: '0 0 0.5rem' }}>Business — Sur devis</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#7A8876', margin: '0 0 1.25rem', lineHeight: 1.65 }}>Marques cosmétiques, réseaux de spas, groupes hôteliers. Volume illimité, intégration sur-mesure, branding complet.</p>
          <a href="mailto:contact.skinalyze@sassify.fr" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#8B9E6E', textDecoration: 'none', borderBottom: '1px solid #8B9E6E50', paddingBottom: 2 }}>Contacter l&apos;équipe →</a>
        </div>
      </div>
      <style>{`
        @keyframes badgePulse { 0%,100%{box-shadow:0 0 0 0 rgba(196,151,90,0.4)} 50%{box-shadow:0 0 0 8px rgba(196,151,90,0)} }
        .animate-badge-pulse { animation: badgePulse 2s infinite; }
        @media (max-width: 767px) { .pricing-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
