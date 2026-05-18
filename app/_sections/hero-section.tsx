import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #FAF8F4 0%, #F0EDE5 40%, #EBF0E4 100%)',
        paddingTop: 100,
      }}
    >
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '15%', right: '8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #C4975A18 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #8B9E6E20 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div
        className="hero-grid"
        style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}
      >
        {/* Copy */}
        <div className="hero-copy">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#EBF0E4', border: '1px solid #8B9E6E40', borderRadius: 50, padding: '6px 16px', marginBottom: '1.5rem' }}>
            <div className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B9E6E' }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#6B7C54', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solution B2B · Instituts &amp; Spas</span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 1.5rem' }}>
            En 60 secondes, chaque client repart avec un{' '}
            <em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>diagnostic peau personnalisé</em>
          </h1>

          <p className="hero-subtitle" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.15rem', fontWeight: 400, color: '#7A8876', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 500 }}>
            Co-analysé par un dermatologue, un cosmétologue et un coach bien-être.{' '}
            <strong style={{ color: '#3D4A3A', fontWeight: 500 }}>Sans installation. Sans engagement.</strong>
          </p>

          <div className="hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/diagnostic" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', background: 'linear-gradient(135deg, #8B9E6E 0%, #6B7C54 100%)', padding: '0.9rem 2rem', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 20px #8B9E6E45', letterSpacing: '0.01em' }}>
              <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="18"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              Tester gratuitement
            </Link>
            <Link href="#tarifs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 500, color: '#3D4A3A', textDecoration: 'none', padding: '0.9rem 1.5rem', borderRadius: 50, border: '1.5px solid #8B9E6E50', background: 'rgba(255,255,255,0.6)' }}>
              Voir les tarifs →
            </Link>
          </div>

          <div className="hero-trust" style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            {[{ val: '60s', label: 'Diagnostic' }, { val: '3', label: 'Expertises' }, { val: '100%', label: 'Web, sans install' }].map((t) => (
              <div key={t.val} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#8B9E6E' }}>{t.val}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#7A8876', fontWeight: 400, lineHeight: 1.3 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mockup */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div className="animate-float hero-mockup" style={{ position: 'relative' }}>
            <div style={{ width: 360, background: '#FFFFFF', borderRadius: 24, boxShadow: '0 30px 80px rgba(28, 36, 32, 0.18), 0 0 0 1px rgba(139,158,110,0.15)', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg fill="none" height="14" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
                  </div>
                  <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Diagnostic Skinalyze</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 50, padding: '4px 10px' }}>
                  <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>IA Active</span>
                </div>
              </div>
              {/* Face illustration */}
              <div style={{ padding: 20, background: '#EBF0E4', display: 'flex', justifyContent: 'center' }}>
                <svg fill="none" height="120" viewBox="0 0 120 120" width="120">
                  <ellipse cx="60" cy="65" fill="#F5E8D5" rx="38" ry="46" stroke="#8B9E6E" strokeWidth="1.5" />
                  <ellipse cx="60" cy="50" fill="#FAF0E6" rx="28" ry="32" />
                  <ellipse cx="48" cy="50" fill="#3D2B1F" rx="5" ry="5.5" />
                  <ellipse cx="72" cy="50" fill="#3D2B1F" rx="5" ry="5.5" />
                  <circle cx="50" cy="48" fill="white" r="1.5" />
                  <circle cx="74" cy="48" fill="white" r="1.5" />
                  <path d="M57 58 Q60 62 63 58" fill="none" stroke="#C4975A" strokeLinecap="round" strokeWidth="1.5" />
                  <path d="M50 70 Q60 78 70 70" fill="none" stroke="#C4975A" strokeLinecap="round" strokeWidth="1.5" />
                  <line opacity="0.6" stroke="#8B9E6E" strokeDasharray="3 3" strokeWidth="0.8" x1="22" x2="98" y1="40" y2="40" />
                  <line opacity="0.6" stroke="#8B9E6E" strokeDasharray="3 3" strokeWidth="0.8" x1="22" x2="98" y1="55" y2="55" />
                  <line opacity="0.6" stroke="#8B9E6E" strokeDasharray="3 3" strokeWidth="0.8" x1="22" x2="98" y1="70" y2="70" />
                  <path d="M22 30 L22 22 L30 22" fill="none" stroke="#8B9E6E" strokeLinecap="round" strokeWidth="2" />
                  <path d="M98 30 L98 22 L90 22" fill="none" stroke="#8B9E6E" strokeLinecap="round" strokeWidth="2" />
                  <path d="M22 90 L22 98 L30 98" fill="none" stroke="#8B9E6E" strokeLinecap="round" strokeWidth="2" />
                  <path d="M98 90 L98 98 L90 98" fill="none" stroke="#8B9E6E" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </div>
              {/* Scores */}
              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A8876', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Analyse complète</div>
                {[{ label: 'Hydratation', val: 72, color: '#8B9E6E' }, { label: 'Éclat', val: 85, color: '#C4975A' }, { label: 'Sensibilité', val: 38, color: '#E8A87C' }].map((s) => (
                  <div key={s.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.78rem', color: '#3D4A3A', fontWeight: 500 }}>{s.label}</span>
                      <span style={{ fontSize: '0.78rem', color: s.color, fontWeight: 700 }}>{s.val}%</span>
                    </div>
                    <div style={{ height: 6, background: '#F0EDE8', borderRadius: 50, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.val}%`, background: s.color, borderRadius: 50 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: '10px 14px', background: '#EBF0E4', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg fill="none" height="16" stroke="#8B9E6E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
                  <span style={{ fontSize: '0.78rem', color: '#6B7C54', fontWeight: 500 }}>Rapport PDF généré</span>
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <div style={{ position: 'absolute', top: -15, right: -30, background: '#FFFFFF', borderRadius: 16, padding: '10px 14px', boxShadow: '0 8px 30px rgba(28,36,32,0.15)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #F5E8D5' }}>
              <div style={{ display: 'flex' }}>
                {['#8B9E6E', '#C4975A', '#7A8876'].map((c, i) => (
                  <div key={c} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i === 0 ? 0 : -6 }} />
                ))}
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#1C2420', whiteSpace: 'nowrap' }}>3 expertises</span>
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: -35, background: 'linear-gradient(135deg, #C4975A, #E8A87C)', borderRadius: 16, padding: '10px 14px', boxShadow: '0 8px 25px rgba(196,151,90,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg fill="none" height="14" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="14"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>60 secondes</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .animate-pulse-dot { animation: pulse-dot 2s infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @media (max-width: 767px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-subtitle { max-width: none !important; font-size: 1.05rem !important; }
          .hero-actions a { width: 100% !important; justify-content: center !important; }
          .hero-trust { gap: 1rem !important; }
          .hero-mockup { display: none !important; }
        }
      `}</style>
    </section>
  );
}
