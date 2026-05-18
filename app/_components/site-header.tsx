'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '0 1rem',
          transition: '0.3s',
          background: scrolled ? 'rgba(250, 248, 244, 0.96)' : 'rgba(250, 248, 244, 0.85)',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(6px)',
          borderBottom: scrolled ? '1px solid rgb(235, 240, 228)' : '1px solid transparent',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: '1rem' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minWidth: 0 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg fill="none" height="20" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 8v4l3 3" />
                  <circle cx="18" cy="6" fill="white" r="3" stroke="none" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 600, color: '#1C2420', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                Skinalyze
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="site-header-links" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              {[
                { href: '/#benefices', label: 'Bénéfices' },
                { href: '/#processus', label: 'Processus' },
                { href: '/#tarifs', label: 'Tarifs' },
                { href: '/#faq', label: 'FAQ' },
                { href: '/diagnostic', label: 'Diagnostic' },
                { href: '/blog', label: 'Blog' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 500, color: '#3D4A3A', textDecoration: 'none', letterSpacing: '0.02em' }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/diagnostic"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', background: 'linear-gradient(135deg, #8B9E6E 0%, #6B7C54 100%)', padding: '0.55rem 1.25rem', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 14px #8B9E6E40' }}
              >
                Tester gratuitement
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="site-header-mobile-toggle"
              aria-label="Ouvrir le menu de navigation"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 16, border: '1px solid #EBF0E4', background: 'rgba(255,255,255,0.8)', color: '#1C2420', fontSize: '1.55rem', cursor: 'pointer', flexShrink: 0 }}
            >
              <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="site-header-mobile-menu"
          style={{ position: 'fixed', top: 72, left: 0, right: 0, bottom: 0, zIndex: 49, background: '#FAF8F4', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {[
            { href: '/#benefices', label: 'Bénéfices' },
            { href: '/#processus', label: 'Processus' },
            { href: '/#tarifs', label: 'Tarifs' },
            { href: '/#faq', label: 'FAQ' },
            { href: '/diagnostic', label: 'Diagnostic' },
            { href: '/blog', label: 'Blog' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', fontWeight: 500, color: '#1C2420', textDecoration: 'none', padding: '0.5rem 0', borderBottom: '1px solid #EBF0E4' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/diagnostic"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', background: 'linear-gradient(135deg, #8B9E6E 0%, #6B7C54 100%)', padding: '1rem 1.5rem', borderRadius: 50, textDecoration: 'none', marginTop: 'auto', boxShadow: '0 4px 20px #8B9E6E45' }}
          >
            Tester gratuitement
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .site-header-mobile-toggle,
          .site-header-mobile-menu {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .site-header-links {
            display: none !important;
          }
          .site-header-mobile-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  );
}
