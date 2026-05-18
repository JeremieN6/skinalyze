'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin/stats');
    } else {
      setError('Mot de passe incorrect.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '2.5rem', maxWidth: 400, width: '100%', boxShadow: '0 8px 40px rgba(28,36,32,0.1)', border: '1px solid #E8E4DC' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#1C2420', margin: '0 0 0.5rem' }}>Admin Skinalyze</h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#7A8876', margin: '0 0 2rem' }}>Accès réservé</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', padding: '0.8rem 1rem', borderRadius: 12, border: '1.5px solid #E0DDD6', background: '#FAFAF7', outline: 'none', marginBottom: '0.75rem', boxSizing: 'border-box' }}
          />
          {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#DC2626', marginBottom: '0.75rem' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', border: 'none', borderRadius: 50, padding: '0.85rem', cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
