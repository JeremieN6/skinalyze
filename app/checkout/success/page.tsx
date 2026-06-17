"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '@/app/_components/site-header';
import SiteFooter from '@/app/_components/site-footer';

const PRO_CUSTOMER_KEY = 'skinalyze_pro_customer';
const USER_ID_KEY = 'skinalyze_user_id';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    try {
      localStorage.setItem(PRO_CUSTOMER_KEY, 'true');

      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const userId = localStorage.getItem(USER_ID_KEY);

      if (sessionId && userId) {
        fetch('/api/stripe/link-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, userId }),
        }).catch(() => {});
      }
    } catch {}
  }, []);

  return (
    <>
      <SiteHeader />
      <main style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FAF8F4, #EBF0E4)', paddingTop: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
        <div style={{ background: '#FFFFFF', borderRadius: 28, padding: '3rem 2.5rem', maxWidth: 540, width: '100%', textAlign: 'center', boxShadow: '0 8px 50px rgba(28,36,32,0.1)', border: '1px solid rgba(139,158,110,0.2)', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem', boxShadow: '0 6px 24px #8B9E6E50' }}>
            <svg fill="none" height="32" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="32"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1C2420', margin: '0 0 1rem', lineHeight: 1.2 }}>
            Bienvenue dans Skinalyze !
          </h1>
          <p style={{ fontSize: '1rem', color: '#7A8876', lineHeight: 1.75, margin: '0 0 0.75rem' }}>
            Votre abonnement est activé. Vous allez recevoir un email de confirmation dans quelques minutes.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#7A8876', lineHeight: 1.65, margin: '0 0 2.5rem' }}>
            Notre équipe vous contactera sous 24h ouvrées pour vous configurer et vous accompagner lors de votre prise en main.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/diagnostic" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', padding: '0.85rem 1.75rem', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 16px #8B9E6E40' }}>
              Faire un diagnostic →
            </Link>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500, color: '#3D4A3A', padding: '0.85rem 1.5rem', borderRadius: 50, textDecoration: 'none', border: '1.5px solid #E0DDD6' }}>
              Retour à l&apos;accueil
            </Link>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#7A8876', marginTop: '1.75rem' }}>
            Des questions ? <a href="mailto:contact.skinalyze@sassify.fr" style={{ color: '#8B9E6E', textDecoration: 'none', borderBottom: '1px solid #8B9E6E50' }}>contact.skinalyze@sassify.fr</a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
