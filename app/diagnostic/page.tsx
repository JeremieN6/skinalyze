'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

const DIAG_COUNT_KEY = 'skinalyze_diag_count';
const USER_ID_KEY = 'skinalyze_user_id';
const FREE_QUOTA = 3;

function getUserId(): string {
  let uid = localStorage.getItem(USER_ID_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, uid);
  }
  return uid;
}

function track(event: string) {
  try {
    const userId = getUserId();
    const sessionId = sessionStorage.getItem('skinalyze_session_id') ?? (() => {
      const s = crypto.randomUUID();
      sessionStorage.setItem('skinalyze_session_id', s);
      return s;
    })();
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, event, sessionId }),
    }).catch(() => {});
  } catch {}
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

const LOADING_MESSAGES = [
  "Détection de la texture cutanée…",
  "Analyse dermatologique en cours…",
  "Évaluation cosmétologique…",
  "Intégration des données bien-être…",
  "Génération de votre rapport personnalisé…",
];

const STRIPE_STARTER = process.env.NEXT_PUBLIC_STRIPE_STARTER_LINK || 'https://buy.stripe.com/00weVe0v27uTbCWboTePi2c';
const STRIPE_PRO = process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || 'https://buy.stripe.com/cNi9AU91y8yX36qakPePi2d';

type Step = 'upload' | 'loading' | 'followup' | 'results';

interface DiagnosticResult {
  diagnostic: { title: string; content: string };
  routine: { title: string; content: string };
  products: { title: string; content: string };
}

export default function DiagnosticPage() {
  const [step, setStep] = useState<Step>('upload');
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [followUp, setFollowUp] = useState('');
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingInterval = useRef<ReturnType<typeof setInterval>>();

  const getDiagCount = () => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(DIAG_COUNT_KEY) ?? '0', 10);
  };
  const incrementDiagCount = () => {
    const n = getDiagCount() + 1;
    localStorage.setItem(DIAG_COUNT_KEY, String(n));
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).slice(0, 3 - images.length);
    const compressed = await Promise.all(arr.map(compressImage));
    setImages((prev) => [...prev, ...compressed].slice(0, 3));
  }, [images]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const startAnalysis = async () => {
    if (!images.length) return;
    const count = getDiagCount();
    if (count >= FREE_QUOTA) {
      setShowPremiumModal(true);
      return;
    }
    incrementDiagCount();
    track('diagnostic_started');
    setStep('loading');
    setLoadingProgress(0);
    setLoadingMsg(0);

    let msgIdx = 0;
    let progress = 0;
    loadingInterval.current = setInterval(() => {
      progress += 4;
      setLoadingProgress(Math.min(progress, 95));
      if (progress % 18 === 0 && msgIdx < LOADING_MESSAGES.length - 1) {
        msgIdx++;
        setLoadingMsg(msgIdx);
      }
    }, 400);

    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images, followUp }),
      });
      clearInterval(loadingInterval.current);
      setLoadingProgress(100);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResult(data);
      track('diagnostic_completed');
      setTimeout(() => setStep('results'), 400);
    } catch {
      clearInterval(loadingInterval.current);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setStep('upload');
    }
  };

  useEffect(() => {
    return () => { if (loadingInterval.current) clearInterval(loadingInterval.current); };
  }, []);

  const sharedCard: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: 20,
    padding: '1.75rem',
    border: '1px solid #E8E4DC',
    boxShadow: '0 2px 12px rgba(28,36,32,0.06)',
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FAF8F4 0%, #EBF0E4 100%)', paddingTop: 90, paddingBottom: 60, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#7A8876', textDecoration: 'none', marginBottom: '1.25rem' }}>
              ← Retour
            </Link>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, margin: '0 0 0.75rem' }}>
              Votre diagnostic peau <em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>gratuit</em>
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#7A8876', lineHeight: 1.65, margin: 0 }}>Analyse par IA · 3 expertises · Résultat en 60 secondes</p>
          </div>

          {/* Free quota banner */}
          {step === 'upload' && typeof window !== 'undefined' && (
            <div style={{ marginBottom: '1.5rem', padding: '10px 16px', background: '#EBF0E4', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg fill="none" height="14" stroke="#8B9E6E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
              <span style={{ fontSize: '0.78rem', color: '#6B7C54', fontWeight: 500 }}>
                {Math.max(0, FREE_QUOTA - getDiagCount())} diagnostic{Math.max(0, FREE_QUOTA - getDiagCount()) !== 1 ? 's' : ''} gratuit{Math.max(0, FREE_QUOTA - getDiagCount()) !== 1 ? 's' : ''} restant{Math.max(0, FREE_QUOTA - getDiagCount()) !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Upload Step */}
          {step === 'upload' && (
            <div style={sharedCard}>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? '#8B9E6E' : '#D5D0C8'}`,
                  borderRadius: 16,
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragging ? '#EBF0E440' : '#FAFAF7',
                  transition: 'border-color 0.2s, background 0.2s',
                  marginBottom: images.length ? '1.5rem' : 0,
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 600, color: '#1C2420', margin: '0 0 0.5rem' }}>
                  {images.length === 0 ? 'Déposez vos photos ici' : 'Ajouter d\'autres photos'}
                </p>
                <p style={{ fontSize: '0.8rem', color: '#7A8876', margin: 0 }}>JPG, PNG, WEBP · Max 3 photos · Visage bien éclairé</p>
              </div>

              {images.length > 0 && (
                <>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {images.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: 90, height: 90 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Photo ${i + 1}`} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '2px solid #8B9E6E40' }} />
                        <button
                          onClick={(e) => { e.stopPropagation(); setImages((prev) => prev.filter((_, j) => j !== i)); }}
                          style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#1C2420', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  {error && <p style={{ fontSize: '0.85rem', color: '#DC2626', marginBottom: '1rem' }}>{error}</p>}
                  <button
                    onClick={startAnalysis}
                    style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', border: 'none', borderRadius: 50, padding: '1rem 2rem', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 4px 20px #8B9E6E45' }}
                  >
                    Lancer l&apos;analyse →
                  </button>
                </>
              )}
            </div>
          )}

          {/* Loading Step */}
          {step === 'loading' && (
            <div style={{ ...sharedCard, textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', animation: 'spin 2s linear infinite' }}>
                <svg fill="none" height="30" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="30"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#1C2420', margin: '0 0 0.75rem' }}>Analyse en cours…</h3>
              <p style={{ fontSize: '0.9rem', color: '#7A8876', marginBottom: '2rem', minHeight: '1.4em' }}>{LOADING_MESSAGES[loadingMsg]}</p>
              <div style={{ background: '#EBF0E4', borderRadius: 50, height: 8, overflow: 'hidden', maxWidth: 320, margin: '0 auto' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #8B9E6E, #C4975A)', borderRadius: 50, width: `${loadingProgress}%`, transition: 'width 0.4s ease' }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#7A8876', marginTop: '0.75rem' }}>{loadingProgress}%</p>
              <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
            </div>
          )}

          {/* Results Step */}
          {step === 'results' && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, #EBF0E4, #F5F2EC)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <svg fill="none" height="20" stroke="#8B9E6E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="20"><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 600, color: '#1C2420' }}>Votre diagnostic est prêt !</span>
              </div>

              {[
                { key: 'diagnostic' as const, icon: '🔬', color: '#8B9E6E' },
                { key: 'routine' as const, icon: '✨', color: '#C4975A' },
                { key: 'products' as const, icon: '🧴', color: '#6B7C54' },
              ].map(({ key, icon, color }) => (
                <div key={key} style={sharedCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, color: '#1C2420', margin: 0 }}>{result[key].title}</h3>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#3D4A3A', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{result[key].content}</p>
                </div>
              ))}

              {/* B2B CTA block */}
              <div style={{ padding: '2.25rem', borderRadius: 20, background: 'linear-gradient(160deg, #1C2420, #3D4A3A)', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: 'white', margin: '0 0 0.75rem' }}>
                  Vous êtes professionnel ?
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: '0 0 1.75rem', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                  Proposez ce diagnostic à tous vos clients. Intégration immédiate, sans installation, sans engagement.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={STRIPE_STARTER} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#1C2420', background: 'white', padding: '0.8rem 1.75rem', borderRadius: 50, textDecoration: 'none' }}>
                    Starter — 59€/mois
                  </a>
                  <a href={STRIPE_PRO} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', padding: '0.8rem 1.75rem', borderRadius: 50, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                    Pro — 149€/mois
                  </a>
                </div>
              </div>

              <button
                onClick={() => { setImages([]); setResult(null); setFollowUp(''); setStep('upload'); }}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#7A8876', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.5rem' }}
              >
                Faire un nouveau diagnostic
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(28,36,32,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPremiumModal(false); }}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '2.5rem', maxWidth: 520, width: '100%', textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,0.25)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EBF0E4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <svg fill="none" height="24" stroke="#8B9E6E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#1C2420', margin: '0 0 0.75rem' }}>
              Quota gratuit atteint
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#7A8876', lineHeight: 1.65, margin: '0 0 2rem' }}>
              Vous avez utilisé vos {FREE_QUOTA} diagnostics gratuits. Passez à un abonnement pour continuer avec des diagnostics illimités.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={STRIPE_STARTER} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', padding: '0.8rem 1.75rem', borderRadius: 50, textDecoration: 'none' }}>
                Starter — 59€/mois
              </a>
              <a href={STRIPE_PRO} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#1C2420', padding: '0.8rem 1.75rem', borderRadius: 50, textDecoration: 'none', border: '1.5px solid #8B9E6E50' }}>
                Pro — 149€/mois
              </a>
            </div>
            <button onClick={() => setShowPremiumModal(false)} style={{ marginTop: '1.5rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#7A8876', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
