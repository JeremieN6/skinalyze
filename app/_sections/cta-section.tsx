import Link from 'next/link';

export default function CtaSection() {
  return (
    <section style={{ padding: '100px 2rem', background: 'linear-gradient(160deg, #6B7C54 0%, #1C2420 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,151,90,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,158,110,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1.25rem' }}>Passez à l&apos;action</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', fontWeight: 700, color: 'white', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 1.25rem' }}>
          Prêt à transformer l&apos;expérience de vos clients&nbsp;?
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
          Rejoignez les instituts qui ont déjà adopté Skinalyze — sans installation, sans engagement.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/diagnostic" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#1C2420', background: 'white', padding: '0.9rem 2rem', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 24px rgba(255,255,255,0.2)', letterSpacing: '0.01em' }}>
            <svg fill="none" height="17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="17"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            Tester gratuitement
          </Link>
          <Link href="#tarifs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', padding: '0.9rem 1.75rem', borderRadius: 50, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.07)' }}>
            Voir les tarifs →
          </Link>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '1.5rem', letterSpacing: '0.02em' }}>Sans engagement · Accès immédiat · Support inclus</p>
      </div>
    </section>
  );
}
