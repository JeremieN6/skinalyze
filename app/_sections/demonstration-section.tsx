'use client';

import { useEffect, useState } from 'react';

export default function DemonstrationSection() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <section id="demo" style={{ position: 'relative', overflow: 'hidden', padding: '92px 2rem', background: 'linear-gradient(180deg, #F5F2EC 0%, #FAF8F4 100%)' }}>
      <div style={{ maxWidth: 1220, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: '2rem', alignItems: 'center' }}>
          <div style={{ maxWidth: 520 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1rem' }}>Comment l’outil s’utilise</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 0 1rem' }}>
              Trois photos, un court traitement,{' '}<em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>un diagnostic lisible immédiatement.</em>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#7A8876', maxWidth: 520, margin: '0 0 1.4rem', lineHeight: 1.75 }}>
              L'outil est pensé pour être compris en quelques secondes. On montre le chemin utilisateur, puis on laisse le prospect regarder la démonstration.
            </p>

            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.4rem' }}>
              {[
                'Le client prend ou transmet 3 photos.',
                'L\'outil analyse automatiquement les images.',
                'Le résultat et les recommandations s\'affichent.',
              ].map((line, index) => (
                <div key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#E8EFDD', color: '#4D5C3D', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{index + 1}</div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#435045', lineHeight: 1.55, margin: 0 }}>{line}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              style={{
                border: 'none',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #1C2420, #384636)',
                color: '#FFFFFF',
                padding: '0.95rem 1.25rem',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow: '0 10px 24px rgba(28,36,32,0.18)',
              }}
            >
              Voir la démonstration
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '18px 24px -18px -18px', borderRadius: 30, background: 'rgba(139,158,110,0.12)', filter: 'blur(18px)' }} />
            <div style={{ position: 'relative', borderRadius: 26, background: '#FFFFFF', border: '1px solid rgba(139,158,110,0.18)', boxShadow: '0 22px 50px rgba(28,36,32,0.11)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.95rem 1.1rem', borderBottom: '1px solid #ECE8DE', background: '#FFFFFF' }}>
                <div>
                  <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#1C2420' }}>Interface Diagnostic</p>
                  <p style={{ margin: '0.15rem 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#7A8876' }}>Démo de prise en main</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#8B9E6E' }} />
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#C4975A' }} />
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#D9D2C6' }} />
                </div>
              </div>

              <div className="demo-stage" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ padding: '1rem', background: '#FBF9F4', borderRight: '1px solid #ECE8DE' }}>
                  <p style={{ margin: '0 0 0.8rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6D7A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Étape 1</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.9rem' }}>
                    {['Face', 'Profil', 'Zoom'].map((label) => (
                      <div key={label} style={{ borderRadius: 14, border: '1px solid #E6E1D5', background: '#FFFFFF', padding: '0.85rem 0.55rem', textAlign: 'center' }}>
                        <div style={{ width: 30, height: 30, margin: '0 auto 0.4rem', borderRadius: '50%', background: '#E8EFDD' }} />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#506049', fontWeight: 600 }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderRadius: 18, border: '1px solid #E8E3D8', background: '#FFFFFF', padding: '0.95rem', marginBottom: '0.85rem' }}>
                    <p style={{ margin: '0 0 0.7rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6D7A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Analyse en cours</p>
                    <div style={{ height: 8, borderRadius: 999, overflow: 'hidden', background: '#E9EFE0' }}>
                      <div className="demo-progress" style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #8B9E6E, #C4975A)' }} />
                    </div>
                  </div>

                  <div style={{ borderRadius: 18, border: '1px solid #E6E1D5', background: '#FFFFFF', padding: '0.95rem' }}>
                    <p style={{ margin: '0 0 0.7rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6D7A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>La valeur client</p>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {[
                        {
                          title: 'Ce qu\'on observe',
                          bg: '#EEF2FF',
                          border: '#D7E1FF',
                          hint: 'Zones clés + priorités',
                        },
                        {
                          title: 'Routine & bien-être',
                          bg: '#EFF7ED',
                          border: '#D5E8D0',
                          hint: 'Gestes simples personnalisés',
                        },
                        {
                          title: 'Produits conseillés',
                          bg: '#FFF5E7',
                          border: '#F4DFBF',
                          hint: 'Produit conseillé - Matin / soir',
                        },
                      ].map((item) => (
                        <div key={item.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '0.5rem 0.65rem', borderRadius: 12, background: item.bg, border: `1px solid ${item.border}` }}>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#334235' }}>{item.title}</span>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#556455' }}>{item.hint}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1rem', background: '#F4F1EA' }}>
                  <p style={{ margin: '0 0 0.8rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6D7A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Étape 2 et 3</p>
                  <div style={{ display: 'grid', gap: '0.7rem', marginBottom: '0.95rem' }}>
                    {[
                      'L\'outil traite les images.',
                      'Le diagnostic se construit automatiquement.',
                      'Les recommandations sont prêtes à l\'emploi.',
                    ].map((line) => (
                      <div key={line} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '0.75rem 0.85rem', borderRadius: 14, background: '#FFFFFF', border: '1px solid #E8E3D8' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E8EFDD', color: '#4D5C3D', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '0.68rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>•</div>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.84rem', color: '#435045', lineHeight: 1.5, margin: 0 }}>{line}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderRadius: 16, border: '1px solid #E6E1D5', background: 'linear-gradient(140deg, #FFFFFF 0%, #F9F7F1 100%)', padding: '0.95rem' }}>
                    <p style={{ margin: '0 0 0.6rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#657263', fontWeight: 600 }}>Timeline</p>
                    <div style={{ display: 'grid', gap: '0.55rem' }}>
                      {[
                        { label: 'Upload des 3 photos', time: '20 sec' },
                        { label: 'Analyse automatique', time: '40 sec' },
                        { label: 'Lecture du diagnostic', time: '30 sec' },
                      ].map((item) => (
                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#3D4A3A' }}>{item.label}</span>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.74rem', fontWeight: 700, color: '#8B9E6E' }}>{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Démo Skinalyze"
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(13, 18, 15, 0.72)', zIndex: 60, display: 'grid', placeItems: 'center', padding: '1rem' }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{ width: 'min(920px, 100%)', borderRadius: 20, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.25)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #ECE8DE' }}>
              <div>
                <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#1C2420' }}>Démo Skinalyze</h3>
                <p style={{ margin: '0.2rem 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#6D7A6A' }}>Parcours ultra simple : 3 photos, analyse, diagnostic.</p>
              </div>
              <button type="button" aria-label="Fermer la démo" onClick={() => setIsOpen(false)} style={{ border: 'none', background: '#F2F0EA', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', color: '#3D4A3A' }}>
                ✕
              </button>
            </div>

            <div style={{ padding: '1.25rem', background: 'linear-gradient(150deg, #FCFBF8, #F5F8F0)' }}>
              <div className="demo-visual-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1rem' }}>
                <div style={{ borderRadius: 16, border: '1px solid #E8E3D8', background: '#FFFFFF', padding: '1rem' }}>
                  <p style={{ margin: '0 0 0.8rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6D7A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Étape 1 · Vous importez des photos</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                    {['Face', 'Profil', 'Zoom'].map((label) => (
                      <div key={label} style={{ borderRadius: 12, border: '1px dashed #B8C7A6', background: '#FAFCF8', padding: '0.9rem 0.6rem', textAlign: 'center' }}>
                        <div style={{ width: 30, height: 30, margin: '0 auto 0.45rem', borderRadius: '50%', background: '#DFEAD3' }} />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.74rem', color: '#506049', fontWeight: 600 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderRadius: 16, border: '1px solid #E8E3D8', background: '#FFFFFF', padding: '1rem' }}>
                  <p style={{ margin: '0 0 0.8rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6D7A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Étape 2 · Analyse professionnelle de Skinalyze</p>
                  <div style={{ height: 8, borderRadius: 999, overflow: 'hidden', background: '#E9EFE0' }}>
                    <div className="demo-progress" style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #8B9E6E, #C4975A)' }} />
                  </div>
                  <ul style={{ margin: '0.9rem 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: '0.55rem' }}>
                    {['Hydratation', 'Sensibilité', 'Uniformité du teint'].map((item) => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="demo-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B9E6E' }} />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#425042' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '1rem', borderRadius: 16, border: '1px solid #DDE8CE', background: '#FFFFFF', padding: '1rem' }}>
                <p style={{ margin: '0 0 0.75rem', fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6D7A6A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Étape 3 · Obtenez votre Diagnostic final</p>
                <div className="demo-value-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {[
                    {
                      title: 'Ce qu’on observe - Expertise Dermatologique',
                      bg: '#EEF2FF',
                      border: '#D7E1FF',
                      points: ['Zones clés à traiter', 'Priorités client visibles'],
                    },
                    {
                      title: 'Routine & bien-être - Expert en hygiène de vie',
                      bg: '#EFF7ED',
                      border: '#D5E8D0',
                      points: ['2-3 gestes personnalisés', 'Conseils hygiène de vie'],
                    },
                    {
                      title: 'Produits conseillés - Expert en cosmétique et formulation',
                      bg: '#FFF5E7',
                      border: '#F4DFBF',
                      points: ['Sélection matin / soir', 'Argument de vente additionnelle guidée'],
                    },
                  ].map((section) => (
                    <div key={section.title} style={{ borderRadius: 12, background: section.bg, border: `1px solid ${section.border}`, padding: '0.65rem' }}>
                      <p style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.74rem', color: '#334235', fontWeight: 700 }}>{section.title}</p>
                      <div style={{ marginTop: '0.45rem', display: 'grid', gap: '0.35rem' }}>
                        {section.points.map((point) => (
                          <p key={point} style={{ margin: 0, fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: '#516150', lineHeight: 1.4 }}>
                            • {point}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ margin: '0.85rem 0 0', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#6D7A6A' }}>
                {/* Astuce : ajoutez <strong>NEXT_PUBLIC_DEMO_VIDEO_URL</strong> dans votre environnement pour afficher votre vraie vidéo ici. */}
                <em>Objectif : Obtenez un résultat clair, avec un <strong>diagnostic</strong>, une <strong>routine soin</strong> et des <strong>produits adaptés</strong>.</em>
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .demo-stage { grid-template-columns: 1fr !important; }
          .demo-value-grid { grid-template-columns: 1fr !important; }
        }

        @keyframes demoPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.8); opacity: 0.65; }
        }

        @keyframes demoProgress {
          0% { transform: translateX(-40%); }
          100% { transform: translateX(0%); }
        }

        .demo-pulse,
        .demo-dot {
          animation: demoPulse 1.8s ease-in-out infinite;
        }

        .demo-progress {
          animation: demoProgress 1.5s ease-out infinite alternate;
        }
      `}</style>
    </section>
  );
}