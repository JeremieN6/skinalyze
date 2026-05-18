'use client';

import { useState } from 'react';

const faqs = [
  {
    q: "Comment fonctionne l'analyse IA ?",
    a: "L'utilisateur uploade une photo de son visage. Notre IA analyse la texture, le teint, les pores et plusieurs dizaines de marqueurs cutanés. En moins de 60 secondes, trois rapports sont générés : dermatologique, cosmétique et bien-être.",
  },
  {
    q: "Faut-il installer quelque chose ?",
    a: "Non. Skinalyze fonctionne 100% dans le navigateur. Pas d'application à télécharger, pas de compte client à créer. Un lien suffit.",
  },
  {
    q: "Les données de mes clients sont-elles sécurisées ?",
    a: "Les photos sont analysées en temps réel puis supprimées immédiatement. Aucune image n'est conservée sur nos serveurs. Les rapports sont générés côté serveur et transmis chiffrés.",
  },
  {
    q: "Puis-je personnaliser le rapport avec ma marque ?",
    a: "Oui, sur les offres Pro et Business. Vous pouvez intégrer votre logo, vos couleurs et vos recommandations produits personnalisées.",
  },
  {
    q: "Que se passe-t-il après mes 50 diagnostics Starter ?",
    a: "Vous recevez un email d'alerte à 80% de consommation. Vous pouvez upgrader en Pro en un clic pour continuer sans interruption.",
  },
  {
    q: "Y a-t-il une période d'engagement minimum ?",
    a: "Non. Les abonnements Starter et Pro sont mensuels, sans engagement. Vous pouvez résilier à tout moment depuis votre espace client.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: '100px 2rem', background: '#FFFFFF' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B9E6E', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1rem' }}>FAQ</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: 0 }}>
            Questions fréquentes
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{ borderRadius: 16, border: `1.5px solid ${isOpen ? '#8B9E6E60' : '#E8E4DC'}`, background: isOpen ? '#FAFAF7' : '#FFFFFF', overflow: 'hidden', transition: 'border-color 0.2s' }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}
                >
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: '#1C2420', lineHeight: 1.4 }}>{item.q}</span>
                  <span style={{ color: '#8B9E6E', fontSize: '1.25rem', fontWeight: 300, flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.25rem' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#7A8876', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#7A8876', marginBottom: '0.5rem' }}>Vous n&apos;avez pas trouvé la réponse ?</p>
          <a href="mailto:contact@skinalyze.fr" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#8B9E6E', textDecoration: 'none', borderBottom: '1px solid #8B9E6E50', paddingBottom: 2 }}>Contactez-nous →</a>
        </div>
      </div>
    </section>
  );
}
