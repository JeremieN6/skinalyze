const steps = [
  {
    num: '01',
    icon: (
      <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="32">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
      </svg>
    ),
    title: 'Le client prend une photo',
    desc: 'En cabine, sur la tablette ou le smartphone. Pas d\'app à télécharger, pas de compte à créer.',
  },
  {
    num: '02',
    icon: (
      <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="32">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "L'outil analyse la peau",
    desc: "En moins de 60 secondes, trois angles d'analyse : dermatologique, cosmétique et bien-être.",
  },
  {
    num: '03',
    icon: (
      <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="32">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" />
      </svg>
    ),
    title: 'Rapport personnalisé généré',
    desc: 'Un rapport structuré ou un affichage écran avec recommandations produits adaptées. Signé par votre structure.',
  },
];

export default function ProcessSection() {
  return (
    <section id="processus" style={{ padding: '100px 2rem', background: 'linear-gradient(180deg, #F5F2EC 0%, #FAF8F4 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1rem' }}>Comment ça marche</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: 0 }}>
            Simple pour vous. <em style={{ color: '#C4975A', fontStyle: 'italic' }}>Impressionnant pour vos clients.</em>
          </h2>
        </div>

        <div className="process-steps" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 60, left: 'calc(16.666% + 1rem)', right: 'calc(16.666% + 1rem)', height: 2, background: 'linear-gradient(90deg, #8B9E6E, #C4975A, #8B9E6E)', opacity: 0.3, pointerEvents: 'none' }} />
          {steps.map((s) => (
            <div key={s.num} style={{ flex: 1 }}>
              <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #8B9E6E20, #C4975A20)', border: '2px solid #8B9E6E40', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#8B9E6E', position: 'relative' }}>
                  {s.icon}
                  <div style={{ position: 'absolute', top: -8, right: -8, width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 800, color: 'white' }}>{s.num}</span>
                  </div>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600, color: '#1C2420', margin: '0 0 0.75rem', lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#7A8876', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 767px) { .process-steps { flex-direction: column !important; } }`}</style>
    </section>
  );
}
