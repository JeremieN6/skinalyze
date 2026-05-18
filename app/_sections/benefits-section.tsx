const benefits = [
  {
    icon: (
      <svg fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="28">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Diagnostic en 60 secondes',
    desc: 'Upload d\'une photo, résultat immédiat. Votre client n\'attend pas — l\'expérience est fluide et mémorable.',
  },
  {
    icon: (
      <svg fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="28">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: '3 expertises en 1',
    desc: 'Dermatologue, cosmétologue et coach bien-être. Trois angles d\'analyse fusionnés en un seul rapport premium.',
  },
  {
    icon: (
      <svg fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="28">
        <rect height="20" rx="2" ry="2" width="14" x="5" y="2" /><line x1="12" x2="12.01" y1="18" y2="18" />
      </svg>
    ),
    title: 'Zéro friction',
    desc: 'Aucune installation. Fonctionne sur tablette, smartphone, ordinateur. Votre client est prêt en 10 secondes.',
  },
  {
    icon: (
      <svg fill="none" height="28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="28">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Valorise votre expertise',
    desc: 'Vos clients repartent avec un rapport personnalisé signé par votre structure. Augmentez vos ventes de soins.',
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefices" style={{ padding: '100px 2rem', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B9E6E', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1rem' }}>Ce que vous gagnez</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>
            Tout le pouvoir d&apos;une analyse experte, <em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>sans la complexité</em>
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#7A8876', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>Conçu pour s&apos;intégrer naturellement dans votre protocole cabine.</p>
        </div>

        <div className="benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {benefits.map((b) => (
            <div key={b.title} style={{ padding: '2rem 1.75rem', borderRadius: 20, background: '#FAFAF7', border: '1px solid #E8E4DC', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#8B9E6E', marginBottom: '1.25rem', display: 'inline-flex', padding: 12, background: '#EBF0E4', borderRadius: 14 }}>
                {b.icon}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600, color: '#1C2420', margin: '0 0 0.75rem', lineHeight: 1.3 }}>{b.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#7A8876', lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) { .benefits-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .benefits-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
