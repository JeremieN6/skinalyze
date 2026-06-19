'use client';

import { useState } from 'react';

export default function DemoFormSection() {
  const [form, setForm] = useState({ name: '', email: '', company: '', structure_type: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', company: '', structure_type: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    color: '#1C2420',
    background: '#FAFAF7',
    border: '1.5px solid #E0DDD6',
    borderRadius: 12,
    padding: '0.75rem 1rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#3D4A3A',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const checkIcon = (
    <svg fill="none" height="13" stroke="#8B9E6E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" width="13">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <section id="demo" style={{ padding: '100px 2rem', background: 'linear-gradient(160deg, #F5F2EC 0%, #FAF8F4 100%)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1rem' }}>Programme pilote</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>
            Pas encore prêt à vous engager ?{' '}<em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>Testez avec vos vrais clients.</em>
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#7A8876', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Réservez votre accès pilote gratuit — 14 jours, diagnostics illimités, aucune carte requise.<br />On vous contacte sous 24h pour vous configurer.
          </p>
        </div>

        <div className="demo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div style={{ padding: '2.5rem', background: '#FFFFFF', borderRadius: 24, border: '1px solid rgba(139,158,110,0.2)', boxShadow: '0 4px 24px rgba(28,36,32,0.07)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', flexShrink: 0 }}>
                {[{ initials: 'ML', color1: '#8B9E6E60', color2: '#8B9E6E', z: 3 }, { initials: 'SR', color1: '#C4975A60', color2: '#C4975A', z: 2 }, { initials: 'CB', color1: '#6B7C5460', color2: '#6B7C54', z: 1 }].map((a, i) => (
                  <div key={a.initials} style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${a.color1}, ${a.color2})`, border: '2.5px solid white', marginLeft: i === 0 ? 0 : -10, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: a.z, position: 'relative' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 800, color: 'white' }}>{a.initials}</span>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#1C2420', margin: 0, lineHeight: 1.4 }}>3 instituts ont rejoint le programme pilote cette semaine</p>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#7A8876' }}>Places limitées</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: '14 jours offerts', desc: 'Accès complet sans engagement.' },
                { title: 'Diagnostics illimités', desc: 'Testez avec autant de clients que vous voulez.' },
                { title: 'Configuration en 24h', desc: 'Notre équipe vous guide pas à pas.' },
                { title: 'Aucun engagement', desc: 'Vous arrêtez quand vous voulez.' },
              ].map((b) => (
                <div key={b.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ color: '#8B9E6E', fontSize: '1rem', marginTop: 2, flexShrink: 0 }}>✦</span>
                  <div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#1C2420', marginBottom: 2 }}>{b.title}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#7A8876', lineHeight: 1.5 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.25rem', background: '#EBF0E4', borderRadius: 16, borderLeft: '3px solid #8B9E6E' }}>
              <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontStyle: 'italic', color: '#3D4A3A', lineHeight: 1.65, margin: 0 }}>
                &ldquo;En seulement 2 semaines, nos clientes nous demandent déjà systématiquement le diagnostic.&rdquo;
              </blockquote>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#7A8876', marginTop: '0.75rem' }}>— Camille B., fondatrice · Maison de beauté, Bordeaux</div>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: 24, boxShadow: '0 8px 40px rgba(28,36,32,0.1)', border: '1px solid rgba(139,158,110,0.15)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, #8B9E6E15, #C4975A10)', borderBottom: '1px solid rgba(139,158,110,0.15)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600, color: '#1C2420', margin: '0 0 0.25rem' }}>Demandez votre accès pilote</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#7A8876', margin: 0 }}>Réponse garantie sous 24h ouvrées</p>
            </div>

            {status === 'success' ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#EBF0E4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <svg fill="none" height="28" stroke="#8B9E6E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="28"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 600, color: '#1C2420', margin: '0 0 0.75rem' }}>Demande envoyée !</h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#7A8876', lineHeight: 1.65, margin: 0 }}>Nous vous contacterons sous 24h ouvrées pour configurer votre accès pilote gratuit.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Prénom &amp; Nom *</label>
                    <input name="name" placeholder="Marie Dupont" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email professionnel *</label>
                    <input name="email" type="email" placeholder="marie@moninstitut.fr" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Nom de l'entreprise *</label>
                    <input name="company" placeholder="Institut Beauté Paris" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Type de structure</label>
                    <select name="structure_type" value={form.structure_type} onChange={(e) => setForm({ ...form, structure_type: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Sélectionner…</option>
                      {['Institut de beauté', 'Spa / Centre bien-être', 'Hôtel / Resort', 'Pharmacie', 'Marque cosmétique', 'Clinique esthétique', 'Autre'].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Message (optionnel)</label>
                  <textarea name="message" placeholder="Décrivez votre contexte, vos questions ou ce que vous attendez du pilote…" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
                </div>
                {status === 'error' && (
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#DC2626', marginBottom: '1rem' }}>Une erreur est survenue. Réessayez ou contactez-nous directement.</p>
                )}
                <button type="submit" disabled={status === 'loading'} style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', border: 'none', borderRadius: 50, padding: '0.9rem 1.5rem', cursor: status === 'loading' ? 'wait' : 'pointer', letterSpacing: '0.02em', boxShadow: '0 4px 20px #8B9E6E45' }}>
                  {status === 'loading' ? 'Envoi en cours…' : 'Demander ma démo gratuite →'}
                </button>
                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                  {['14 jours offerts', 'Sans carte bancaire', 'Réponse sous 24h', 'Sans engagement'].map((b) => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {checkIcon}<span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#7A8876', fontWeight: 500 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .demo-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
