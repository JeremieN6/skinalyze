const testimonials = [
  {
    initials: 'ML',
    name: 'Marie L.',
    role: 'Esthéticienne & gérante · Spa Lumière, Lyon',
    color: '#8B9E6E',
    text: 'Depuis Skinalyze, nos clientes commandent systématiquement le soin recommandé. +23% sur le panier moyen en 6 semaines.',
  },
  {
    initials: 'SR',
    name: 'Sophie R.',
    role: 'Directrice · Institut Marbella, Nice',
    color: '#C4975A',
    text: "J'ai intégré le diagnostic dans mon protocole d'accueil. Chaque cliente se sent prise en charge dès la première minute.",
  },
  {
    initials: 'CB',
    name: 'Camille B.',
    role: 'Fondatrice · Maison de beauté, Bordeaux',
    color: '#6B7C54',
    text: "C'est devenu mon meilleur argument de vente. Mes clientes montrent le rapport à leurs amies — je n'ai jamais eu autant de recommandations.",
  },
];

const stars = Array.from({ length: 5 });

export default function TestimonialsSection() {
  return (
    <section style={{ padding: '100px 2rem', background: 'linear-gradient(135deg, #EBF0E4 0%, #EBE6D8 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B9E6E', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1rem' }}>Témoignages</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>
            Celles qui l&apos;utilisent, <em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>en parlent</em>
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#7A8876', margin: 0, lineHeight: 1.7 }}>Retours de professionnels qui ont intégré Skinalyze dans leur cabinet.</p>
        </div>

        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {testimonials.map((t) => (
            <div key={t.name} style={{ background: '#FFFFFF', borderRadius: 20, padding: '2rem', boxShadow: '0 2px 16px rgba(28,36,32,0.07)', border: '1px solid rgba(139,158,110,0.15)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem' }}>
                {stars.map((_, i) => (
                  <svg key={i} fill="#C4975A" height="16" viewBox="0 0 24 24" width="16"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontStyle: 'italic', color: '#3D4A3A', lineHeight: 1.65, margin: '0 0 1.5rem' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}50, ${t.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>{t.initials}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#1C2420' }}>{t.name}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#7A8876', marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 767px) { .testimonials-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
