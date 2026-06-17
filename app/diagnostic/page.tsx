'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

const DIAG_COUNT_KEY = 'skinalyze_diag_count';
const USER_ID_KEY = 'skinalyze_user_id';
const PRO_CUSTOMER_KEY = 'skinalyze_pro_customer';
const PDF_LOGO_KEY = 'skinalyze_pdf_logo';
const FREE_QUOTA = 3;

interface AuthState {
  authenticated: boolean;
  userId?: string;
  email?: string | null;
  plan?: string;
}

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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Invalid file result'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });
}

function compressLogoImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxDimension = 700;
      const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(img.width * ratio));
      canvas.height = Math.max(1, Math.floor(img.height * ratio));
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png', 0.92));
    };
    img.onerror = () => reject(new Error('Invalid image file'));

    fileToDataUrl(file)
      .then((dataUrl) => {
        img.src = dataUrl;
      })
      .catch(reject);
  });
}

const LOADING_MESSAGES = [
  "Détection de la texture cutanée…",
  "Analyse dermatologique en cours…",
  "Évaluation cosmétologique…",
  "Intégration des données bien-être…",
  "Génération de votre rapport personnalisé…",
];

const BYPASS_QUOTA = process.env.NEXT_PUBLIC_BYPASS_QUOTA === 'true';

type Step = 'upload' | 'loading' | 'followup' | 'results';

interface DiagnosticFinding {
  title: string;
  zones: string;
  severity: string;
  description: string;
}

interface RoutineItem {
  label: string;
  description: string;
}

interface ProductItem {
  name: string;
  badge: string;
  accent: string;
  description: string;
}

interface DiagnosticResult {
  diagnosis: {
    title: string;
    summary: string;
    findings: DiagnosticFinding[];
  };
  routine: {
    title: string;
    items: RoutineItem[];
  };
  products: {
    title: string;
    items: ProductItem[];
  };
}

interface LegacyDiagnosticResult {
  diagnostic: { title: string; content: string };
  routine: { title: string; content: string };
  products: { title: string; content: string };
}

function normalizeDiagnosticResult(raw: DiagnosticResult | LegacyDiagnosticResult): DiagnosticResult {
  if ('diagnosis' in raw) {
    return raw;
  }

  return {
    diagnosis: {
      title: raw.diagnostic.title || "Ce qu'on observe sur votre peau",
      summary: raw.diagnostic.content || '',
      findings: [],
    },
    routine: {
      title: raw.routine.title || 'Votre routine personnalisée',
      items: raw.routine.content
        ? [{ label: raw.routine.title || 'Routine', description: raw.routine.content }]
        : [],
    },
    products: {
      title: raw.products.title || "Les produits qu'il vous faut",
      items: raw.products.content
        ? [{ name: raw.products.title || 'Produit', badge: 'matin et soir', accent: '', description: raw.products.content }]
        : [],
    },
  };
}

export default function DiagnosticPage() {
  const [mounted, setMounted] = useState(false);
  const [isProCustomer, setIsProCustomer] = useState(false);
  const [auth, setAuth] = useState<AuthState>({ authenticated: false });
  const [authEmail, setAuthEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [authStep, setAuthStep] = useState<'idle' | 'code-sent'>('idle');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [serverQuota, setServerQuota] = useState<null | { plan: string; quota: number | -1; used: number; remaining: number | -1 }>(null);
  const [useServerTracking, setUseServerTracking] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [step, setStep] = useState<Step>('upload');
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [followUp, setFollowUp] = useState('');
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [pdfLogo, setPdfLogo] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const loadingInterval = useRef<ReturnType<typeof setInterval>>();

  const refreshAuthAndQuota = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const me = await meRes.json();

      if (me?.authenticated) {
        setAuth({
          authenticated: true,
          userId: me.userId,
          email: me.email,
          plan: me.plan,
        });
        setIsProCustomer(me.plan === 'pro');

        const qRes = await fetch('/api/quota');
        if (qRes.ok) {
          setServerQuota(await qRes.json());
          setUseServerTracking(true);
        }
        return true;
      }
    } catch {}

    setAuth({ authenticated: false });
    return false;
  };

  const requestAuthCode = async () => {
    if (!authEmail.trim()) return;
    setAuthLoading(true);
    setAuthMessage('');
    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail }),
      });
      if (!res.ok) throw new Error('request-code failed');
      setAuthStep('code-sent');
      setAuthMessage('Un code vous a été envoyé par email.');
    } catch {
      setAuthMessage('Impossible d envoyer le code pour le moment.');
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyAuthCode = async () => {
    if (!authCode.trim()) return;
    setAuthLoading(true);
    setAuthMessage('');
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, code: authCode }),
      });
      if (!res.ok) throw new Error('verify-code failed');
      setAuthMessage('Connexion réussie.');
      await refreshAuthAndQuota();
    } catch {
      setAuthMessage('Code invalide ou expiré.');
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setAuth({ authenticated: false });
    setUseServerTracking(false);
    setServerQuota(null);
    setIsProCustomer(false);
  };

  const getCheckoutUrl = (plan: 'starter' | 'pro') => {
    const base = `/api/stripe/checkout?plan=${plan}`;
    if (!mounted) return base;
    try {
      const id = auth.userId || getUserId();
      return `${base}&userId=${encodeURIComponent(id)}`;
    } catch {
      return base;
    }
  };

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

    // Quota enforcement: prefer server-side when available, otherwise localStorage fallback
    if (!BYPASS_QUOTA && !isProCustomer) {
      if (useServerTracking && serverQuota) {
        if (serverQuota.quota !== -1 && serverQuota.remaining <= 0) {
          setShowPremiumModal(true);
          return;
        }
        // server will record usage after successful analysis
      } else {
        const count = getDiagCount();
        if (count >= FREE_QUOTA) {
          setShowPremiumModal(true);
          return;
        }
        incrementDiagCount();
      }
    }

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
      const body: any = { images, followUp };
      if (useServerTracking) body.userId = getUserId();

      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      clearInterval(loadingInterval.current);
      setLoadingProgress(100);
      if (res.status === 402) {
        setShowPremiumModal(true);
        setStep('upload');
        return;
      }
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setResult(normalizeDiagnosticResult(data));
      track('diagnostic_completed');
      setTimeout(() => setStep('results'), 400);

      // refresh server quota after success
      if (useServerTracking) {
        try {
          const qres = await fetch('/api/quota');
          if (qres.ok) setServerQuota(await qres.json());
        } catch {}
      }
    } catch (err) {
      clearInterval(loadingInterval.current);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setStep('upload');
    }
  };

  const handleLogoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setLogoError('Veuillez sélectionner un fichier image (PNG, JPG ou WEBP).');
      return;
    }

    try {
      const compressedLogo = await compressLogoImage(file);
      setPdfLogo(compressedLogo);
      setLogoError('');
      localStorage.setItem(PDF_LOGO_KEY, compressedLogo);
      track('diagnostic_logo_uploaded');
    } catch {
      setLogoError('Le logo n a pas pu être chargé. Réessayez avec une autre image.');
    }
  };

  const removeLogo = () => {
    setPdfLogo(null);
    setLogoError('');
    localStorage.removeItem(PDF_LOGO_KEY);
  };

  const handlePdfDownload = async () => {
    if (!result) return;
    setIsExportingPdf(true);

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 14;
      const marginY = 16;
      const contentWidth = pageWidth - marginX * 2;
      let cursorY = marginY;

      const addPageBackground = () => {
        doc.setFillColor(250, 248, 244);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
      };

      const ensureSpace = (requiredHeight: number) => {
        if (cursorY + requiredHeight > pageHeight - marginY) {
          doc.addPage();
          addPageBackground();
          cursorY = marginY;
        }
      };

      const drawSection = (title: string, lines: string[], color: [number, number, number]) => {
        const titleLines = doc.splitTextToSize(title, contentWidth - 8) as string[];
        const titleHeight = Math.max(6, titleLines.length * 5.5);
        const bodyHeight = Math.max(8, lines.length * 5.1);
        const sectionHeight = 10 + titleHeight + 4 + bodyHeight;

        ensureSpace(sectionHeight + 4);

        doc.setDrawColor(232, 228, 220);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(marginX, cursorY, contentWidth, sectionHeight, 3, 3, 'FD');

        doc.setFillColor(...color);
        doc.roundedRect(marginX, cursorY, contentWidth, 5, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(28, 36, 32);
        doc.setFontSize(13);
        const titleY = cursorY + 11;
        doc.text(titleLines, marginX + 4, titleY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(61, 74, 58);
        doc.setFontSize(10.5);
        doc.text(lines, marginX + 4, titleY + titleHeight + 1.5);

        cursorY += sectionHeight + 5;
      };

      addPageBackground();
      doc.setTextColor(28, 36, 32);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.text('Rapport de diagnostic de peau', marginX, cursorY + 2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(95, 108, 95);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, marginX, cursorY + 8);

      if (pdfLogo) {
        const logoFormat = pdfLogo.includes('image/png') ? 'PNG' : 'JPEG';
        const logoWidth = 30;
        const logoHeight = 16;
        doc.addImage(pdfLogo, logoFormat, pageWidth - marginX - logoWidth, cursorY - 1, logoWidth, logoHeight, undefined, 'FAST');
      }

      cursorY += 16;

      const diagnosisLines = doc.splitTextToSize(result.diagnosis.summary, contentWidth - 8) as string[];
      drawSection(result.diagnosis.title, diagnosisLines, [139, 158, 110]);

      if (result.diagnosis.findings.length > 0) {
        result.diagnosis.findings.forEach((finding) => {
          const findingBody = [
            `Zone(s): ${finding.zones}`,
            `Intensité: ${finding.severity}`,
            '',
            finding.description,
          ].join('\n');
          const lines = doc.splitTextToSize(findingBody, contentWidth - 8) as string[];
          drawSection(finding.title, lines, [93, 124, 255]);
        });
      }

      const routineText = result.routine.items.map((item) => `${item.label}: ${item.description}`).join('\n\n');
      const routineLines = doc.splitTextToSize(routineText || 'Aucune recommandation de routine.', contentWidth - 8) as string[];
      drawSection(result.routine.title, routineLines, [119, 196, 123]);

      const productsText = result.products.items
        .map((item) => `${item.name} (${item.badge}${item.accent ? `, ${item.accent}` : ''})\n${item.description}`)
        .join('\n\n');
      const productsLines = doc.splitTextToSize(productsText || 'Aucune recommandation produit.', contentWidth - 8) as string[];
      drawSection(result.products.title, productsLines, [229, 154, 58]);

      ensureSpace(10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(110, 122, 106);
      doc.text('Document informatif - ne remplace pas un avis médical.', marginX, pageHeight - 10);

      const fileDate = new Date().toISOString().slice(0, 10);
      doc.save(`rapport-diagnostic-peau-${fileDate}.pdf`);
      track('diagnostic_pdf_downloaded');
    } catch {
      setError('Impossible de générer le PDF pour le moment.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const proParam = params.get('pro');

      if (proParam === '1') {
        localStorage.setItem(PRO_CUSTOMER_KEY, 'true');
      } else if (proParam === '0') {
        localStorage.removeItem(PRO_CUSTOMER_KEY);
      }

      setIsProCustomer(localStorage.getItem(PRO_CUSTOMER_KEY) === 'true');
      const savedLogo = localStorage.getItem(PDF_LOGO_KEY);
      if (savedLogo) setPdfLogo(savedLogo);
      // Prefer server session quota; fallback to local pseudo-user when not authenticated.
      (async () => {
        try {
          const sessionRes = await fetch('/api/auth/me');
          if (sessionRes.ok) {
            const me = await sessionRes.json();
            setServerQuota(me.quota);
            setUseServerTracking(true);
            setIsProCustomer(me.quota?.plan === 'pro');
            return;
          }

          const fallbackRes = await fetch(`/api/quota?userId=${getUserId()}`);
          if (!fallbackRes.ok) {
            setUseServerTracking(false);
            setServerQuota(null);
            return;
          }
          const q = await fallbackRes.json();
          setServerQuota(q);
          setUseServerTracking(true);
        } catch {
          setUseServerTracking(false);
          setServerQuota(null);
        }
      })();
    } catch {
      setIsProCustomer(false);
    }

    return () => { if (loadingInterval.current) clearInterval(loadingInterval.current); };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    (async () => {
      const isAuthenticated = await refreshAuthAndQuota();

      // Legacy fallback for anonymous users only.
      if (!isAuthenticated) {
        try {
          const res = await fetch(`/api/quota?userId=${getUserId()}`);
          if (!res.ok) {
            setUseServerTracking(false);
            setServerQuota(null);
            return;
          }
          const q = await res.json();
          setServerQuota(q);
          setUseServerTracking(true);
        } catch {
          setUseServerTracking(false);
          setServerQuota(null);
        }
      }
    })();
  }, [mounted]);

  const requestAuthCode = async () => {
    if (!authEmail.trim()) return;
    setAuthLoading(true);
    setAuthMessage('');
    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail }),
      });
      if (!res.ok) throw new Error('request failed');
      setAuthCodeSent(true);
      setAuthMessage('Code envoyé. Vérifiez votre boite mail.');
    } catch {
      setAuthMessage('Impossible d envoyer le code pour le moment.');
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyAuthCode = async () => {
    if (!authEmail.trim() || !authCode.trim()) return;
    setAuthLoading(true);
    setAuthMessage('');
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, code: authCode }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'verify failed');
      }

      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const me = await meRes.json();
        setServerQuota(me.quota);
        setUseServerTracking(true);
        setIsProCustomer(me.quota?.plan === 'pro');
        setAuthMessage('Connexion réussie. Vos avantages sont restaurés.');
      }
    } catch (e) {
      setAuthMessage('Code invalide ou expiré.');
    } finally {
      setAuthLoading(false);
    }
  };

  const logoutAuth = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUseServerTracking(false);
      setAuthCode('');
      setAuthCodeSent(false);
      setAuthMessage('Session déconnectée sur cet appareil.');
    } catch {}
  };

  const sharedCard: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: 20,
    padding: '1.75rem',
    border: '1px solid #E8E4DC',
    boxShadow: '0 2px 12px rgba(28,36,32,0.06)',
  };

  const reportThemes = {
    diagnosis: {
      surface: '#F3F7FF',
      border: '#CFE0FF',
      title: '#21407A',
      text: '#415A7A',
      accent: '#5D7CFF',
      chipBg: '#EDF2FF',
      chipText: '#4D66D8',
      softCard: '#FFFFFF',
    },
    routine: {
      surface: '#F3FAF1',
      border: '#C3EAC8',
      title: '#23462D',
      text: '#4E6655',
      accent: '#77C47B',
      chipBg: '#EAF8EB',
      chipText: '#4D9B57',
      softCard: '#FFFFFF',
    },
    products: {
      surface: '#FFF6EA',
      border: '#F0D3A8',
      title: '#7A4E18',
      text: '#6A543C',
      accent: '#E59A3A',
      chipBg: '#FFF1D8',
      chipText: '#C8861E',
      softCard: '#FFFFFF',
    },
  } as const;

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FAF8F4 0%, #EBF0E4 100%)', paddingTop: 90, paddingBottom: 60, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#7A8876', textDecoration: 'none', marginBottom: '1.25rem' }}>
              ← Retour
            </Link>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, margin: '0 0 0.75rem' }}>
              Votre diagnostic peau <em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>gratuit</em>
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#7A8876', lineHeight: 1.65, margin: 0 }}>Analyse assistée · 3 expertises · Résultat en 60 secondes</p>
          </div>

          {/* Auth banner */}
          {step === 'upload' && mounted && (
            <div style={{ marginBottom: '1rem', padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E8E4DC', borderRadius: 12 }}>
              {auth.authenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', color: '#41503F' }}>
                    Connecté en tant que <strong>{auth.email || 'utilisateur'}</strong>
                  </span>
                  <button
                    onClick={logout}
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#4A5B46', border: '1px solid #C9D2BE', borderRadius: 999, background: '#F7FAF4', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                  >
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#6B7C54', margin: 0 }}>
                    Connectez-vous par email pour récupérer vos avantages sur tous vos appareils.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      style={{ flex: '1 1 220px', minWidth: 180, border: '1px solid #D5D0C8', borderRadius: 10, padding: '0.55rem 0.65rem', fontSize: '0.82rem', color: '#1C2420', background: '#FAFAF7' }}
                    />
                    <button
                      onClick={requestAuthCode}
                      disabled={authLoading}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: 'white', border: 'none', borderRadius: 999, background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', padding: '0.52rem 0.9rem', cursor: authLoading ? 'default' : 'pointer', opacity: authLoading ? 0.75 : 1 }}
                    >
                      Envoyer le code
                    </button>
                  </div>
                  {authStep === 'code-sent' && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        placeholder="Code à 6 chiffres"
                        style={{ flex: '1 1 180px', minWidth: 140, border: '1px solid #D5D0C8', borderRadius: 10, padding: '0.55rem 0.65rem', fontSize: '0.82rem', color: '#1C2420', background: '#FAFAF7' }}
                      />
                      <button
                        onClick={verifyAuthCode}
                        disabled={authLoading}
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#1C2420', border: '1px solid #C9D2BE', borderRadius: 999, background: '#F7FAF4', padding: '0.52rem 0.9rem', cursor: authLoading ? 'default' : 'pointer', opacity: authLoading ? 0.75 : 1 }}
                      >
                        Valider le code
                      </button>
                    </div>
                  )}
                  {authMessage && <span style={{ fontSize: '0.76rem', color: '#6B7C54' }}>{authMessage}</span>}
                </div>
              )}
            </div>
          )}

          {/* Free quota banner */}
          {step === 'upload' && mounted && !BYPASS_QUOTA && !isProCustomer && (
            <div style={{ marginBottom: '1.5rem', padding: '10px 16px', background: '#EBF0E4', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg fill="none" height="14" stroke="#8B9E6E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="14"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
              <span style={{ fontSize: '0.78rem', color: '#6B7C54', fontWeight: 500 }}>
                {useServerTracking && serverQuota
                  ? (serverQuota.quota === -1 ? 'Diagnostics illimités' : `${serverQuota.remaining} diagnostic${serverQuota.remaining !== 1 ? 's' : ''} restants ce mois`)
                  : `${Math.max(0, FREE_QUOTA - getDiagCount())} diagnostic${Math.max(0, FREE_QUOTA - getDiagCount()) !== 1 ? 's' : ''} gratuit${Math.max(0, FREE_QUOTA - getDiagCount()) !== 1 ? 's' : ''} restant${Math.max(0, FREE_QUOTA - getDiagCount()) !== 1 ? 's' : ''}`}
              </span>
            </div>
          )}

          {step === 'upload' && (
            <div style={{ marginBottom: '1.25rem', padding: '1rem 1rem', borderRadius: 14, border: '1px solid #E8E4DC', background: '#FFFFFF' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#5E6C61', lineHeight: 1.6 }}>
                Déjà abonné sur un autre appareil ? Récupérez vos avantages avec votre email.
              </p>

              {!useServerTracking && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    type="email"
                    placeholder="Votre email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    style={{ border: '1px solid #DCD6CC', borderRadius: 10, padding: '0.65rem 0.75rem', fontSize: '0.85rem' }}
                  />

                  {authCodeSent && (
                    <input
                      type="text"
                      placeholder="Code à 6 chiffres"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      style={{ border: '1px solid #DCD6CC', borderRadius: 10, padding: '0.65rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  )}

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={requestAuthCode}
                      disabled={authLoading || !authEmail.trim()}
                      style={{ border: '1px solid #C9D2BE', background: '#F7FAF4', color: '#1C2420', borderRadius: 999, padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontWeight: 600, cursor: authLoading ? 'default' : 'pointer' }}
                    >
                      {authLoading ? 'Envoi...' : 'Recevoir un code'}
                    </button>
                    {authCodeSent && (
                      <button
                        onClick={verifyAuthCode}
                        disabled={authLoading || !authCode.trim()}
                        style={{ border: 'none', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', color: 'white', borderRadius: 999, padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontWeight: 700, cursor: authLoading ? 'default' : 'pointer' }}
                      >
                        {authLoading ? 'Vérification...' : 'Valider le code'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {useServerTracking && (
                <div style={{ marginTop: '0.7rem' }}>
                  <button
                    onClick={logoutAuth}
                    style={{ border: '1px solid #DCD6CC', background: 'white', color: '#6D7A6A', borderRadius: 999, padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Se déconnecter de cet appareil
                  </button>
                </div>
              )}

              {authMessage && <p style={{ margin: '0.6rem 0 0', fontSize: '0.78rem', color: '#6D7A6A' }}>{authMessage}</p>}
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
                  {images.length === 0 ? 'Glissez vos photos ici ou cliquez pour parcourir' : 'Déposez vos photos ici'}
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
                  {/* <button
                    onClick={startAnalysis}
                    style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', border: 'none', borderRadius: 50, padding: '1rem 2rem', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 4px 20px #8B9E6E45' }}
                  >
                    Lancer l&apos;analyse →
                  </button> */}
                  <button
                    onClick={startAnalysis}
                    style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', border: 'none', borderRadius: 50, padding: '1rem 2rem', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 4px 20px #8B9E6E45' }}
                  >
                    🔬 Lancer l&apos;analyse de ma peau →
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

              <div style={{ ...sharedCard, padding: '1.15rem 1.25rem' }}>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  style={{ display: 'none' }}
                  onChange={(e) => handleLogoUpload(e.target.files)}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600, color: '#1C2420', margin: 0 }}>
                      Rapport PDF personnalisé
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#6D7A6A', margin: '0.35rem 0 0' }}>
                      Apposez votre logo sur le rapport pour renforcer votre image professionnelle.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#1C2420', border: '1px solid #C9D2BE', borderRadius: 999, background: '#F7FAF4', padding: '0.55rem 0.95rem', cursor: 'pointer' }}
                    >
                      {pdfLogo ? 'Remplacer le logo' : 'Uploader un logo'}
                    </button>

                    {pdfLogo && (
                      <button
                        onClick={removeLogo}
                        style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#6D7A6A', border: '1px solid #DCD6CC', borderRadius: 999, background: 'white', padding: '0.55rem 0.95rem', cursor: 'pointer' }}
                      >
                        Retirer le logo
                      </button>
                    )}

                    <button
                      onClick={handlePdfDownload}
                      disabled={isExportingPdf}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: 'white', border: 'none', borderRadius: 999, background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', padding: '0.55rem 0.95rem', cursor: isExportingPdf ? 'default' : 'pointer', opacity: isExportingPdf ? 0.75 : 1 }}
                    >
                      {isExportingPdf ? 'Génération PDF...' : 'Télécharger le PDF'}
                    </button>
                  </div>
                </div>

                {pdfLogo && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pdfLogo} alt="Logo entreprise" style={{ width: 64, height: 40, objectFit: 'contain', background: '#FAFAF7', border: '1px solid #E8E4DC', borderRadius: 8, padding: 4 }} />
                    <span style={{ fontSize: '0.75rem', color: '#6D7A6A' }}>Ce logo sera apposé sur le PDF.</span>
                  </div>
                )}

                {logoError && <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#DC2626' }}>{logoError}</p>}
              </div>

              <section style={{ ...sharedCard, background: reportThemes.diagnosis.surface, borderColor: reportThemes.diagnosis.border, boxShadow: '0 8px 24px rgba(33,64,122,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: '#E4EEFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg fill="none" height="18" stroke={reportThemes.diagnosis.accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" width="18"><path d="M12 2v20" /><path d="M4 8h16" /><path d="M6 6v12" /><path d="M18 6v12" /></svg>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: reportThemes.diagnosis.title, margin: 0 }}>{result.diagnosis.title}</h3>
                </div>

                <div style={{ background: reportThemes.diagnosis.softCard, borderRadius: 16, padding: '1rem 1.1rem', border: '1px solid rgba(95,124,255,0.08)', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.92rem', color: reportThemes.diagnosis.text, lineHeight: 1.7, margin: 0 }}>{result.diagnosis.summary}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.diagnosis.findings.map((finding, index) => (
                    <div key={`${finding.title}-${index}`} style={{ background: '#FFFFFF', borderRadius: 16, padding: '1rem 1.1rem', border: '1px solid rgba(95,124,255,0.12)', boxShadow: '0 2px 10px rgba(33,64,122,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <span style={{ color: reportThemes.diagnosis.accent, fontWeight: 700, lineHeight: 1 }}>&gt;</span>
                          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1C2420', margin: 0 }}>{finding.title}</h4>
                        </div>
                        <span style={{ flexShrink: 0, padding: '0.25rem 0.7rem', borderRadius: 999, background: reportThemes.diagnosis.chipBg, color: reportThemes.diagnosis.chipText, fontSize: '0.72rem', fontWeight: 700, lineHeight: 1.1 }}>{finding.severity}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#5E6C7A', margin: '0 0 0.35rem' }}>{finding.zones}</p>
                      <p style={{ fontSize: '0.88rem', color: reportThemes.diagnosis.text, lineHeight: 1.7, margin: 0 }}>{finding.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section style={{ ...sharedCard, background: reportThemes.routine.surface, borderColor: reportThemes.routine.border, boxShadow: '0 8px 24px rgba(35,70,45,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: '#E1F2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg fill="none" height="18" stroke={reportThemes.routine.accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" width="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z" /></svg>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: reportThemes.routine.title, margin: 0 }}>{result.routine.title}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.routine.items.map((item, index) => (
                    <div key={`${item.label}-${index}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#FFFFFF', borderRadius: 16, padding: '1rem 1.1rem', border: '1px solid rgba(119,196,123,0.12)', boxShadow: '0 2px 10px rgba(35,70,45,0.04)' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 10, background: '#F2F6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.9rem' }}>✦</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: reportThemes.routine.accent, marginBottom: '0.25rem' }}>{item.label}</div>
                        <p style={{ fontSize: '0.88rem', color: reportThemes.routine.text, lineHeight: 1.7, margin: 0 }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section style={{ ...sharedCard, background: reportThemes.products.surface, borderColor: reportThemes.products.border, boxShadow: '0 8px 24px rgba(122,78,24,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: '#FFEAD0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg fill="none" height="18" stroke={reportThemes.products.accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" width="18"><path d="M19 7.5V21H5V7.5" /><path d="M8 7.5V5a4 4 0 0 1 8 0v2.5" /><path d="M9 12h6" /></svg>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: reportThemes.products.title, margin: 0 }}>{result.products.title}</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
                  {result.products.items.map((item, index) => (
                    <article key={`${item.name}-${index}`} style={{ background: '#FFFFFF', borderRadius: 16, padding: '1rem 1.1rem 1.05rem', border: '1px solid rgba(229,154,58,0.14)', boxShadow: '0 2px 10px rgba(122,78,24,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: '0.55rem' }}>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1C2420', margin: 0 }}>{item.name}</h4>
                        <span style={{ flexShrink: 0, padding: '0.25rem 0.7rem', borderRadius: 999, background: reportThemes.products.chipBg, color: reportThemes.products.chipText, fontSize: '0.72rem', fontWeight: 700, lineHeight: 1.1 }}>{item.badge}</span>
                      </div>

                      {item.accent && (
                        <div style={{ marginBottom: '0.7rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: reportThemes.products.accent, borderBottom: `1px solid ${reportThemes.products.accent}66`, paddingBottom: 1 }}>{item.accent}</span>
                        </div>
                      )}

                      <p style={{ fontSize: '0.88rem', color: reportThemes.products.text, lineHeight: 1.7, margin: 0 }}>{item.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              {!isProCustomer && (
                <div style={{ padding: '2.25rem', borderRadius: 20, background: 'linear-gradient(160deg, #1C2420, #3D4A3A)', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: 'white', margin: '0 0 0.75rem' }}>
                    Vous êtes professionnel ?
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: '0 0 1.75rem', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                    Proposez ce diagnostic à tous vos clients. Intégration immédiate, sans installation, sans engagement.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href={getCheckoutUrl('starter')} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#1C2420', background: 'white', padding: '0.8rem 1.75rem', borderRadius: 50, textDecoration: 'none' }}>
                      Starter — 59€/mois
                    </a>
                    <a href={getCheckoutUrl('pro')} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', padding: '0.8rem 1.75rem', borderRadius: 50, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                      Pro — 149€/mois
                    </a>
                  </div>
                </div>
              )}

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
      {showPremiumModal && !isProCustomer && (
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
              Vous avez utilisé vos {FREE_QUOTA} diagnostics gratuits. Passez à un abonnement pour continuer avec 50 diagnostics par mois en Starter ou 150 diagnostics par mois en Pro.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={getCheckoutUrl('starter')} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', padding: '0.8rem 1.75rem', borderRadius: 50, textDecoration: 'none' }}>
                Starter — 59€/mois
              </a>
              <a href={getCheckoutUrl('pro')} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#1C2420', padding: '0.8rem 1.75rem', borderRadius: 50, textDecoration: 'none', border: '1.5px solid #8B9E6E50' }}>
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
