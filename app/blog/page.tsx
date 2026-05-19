import Link from 'next/link';
import { Metadata } from 'next';
import articlesData from '@/skincare-spa/src/assets/data/articles.json';
import SiteHeader from '@/app/_components/site-header';
import SiteFooter from '@/app/_components/site-footer';

const articles = [...articlesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

function formatDate(iso: string) {
  const MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MOIS[m - 1]} ${y}`;
}

export const metadata: Metadata = {
  title: 'Blog Skincare — Conseils peau & beauté | Skinalyze',
  description: 'Découvrez nos articles sur les soins de la peau, les routines beauté et les dernières innovations cosmétiques.',
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ minHeight: '100vh', background: '#FAF8F4', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: '1 1 0%', maxWidth: 1200, margin: '0 auto', width: '100%', padding: '7rem 2rem 6rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', padding: '3rem 0 3.5rem', borderBottom: '1px solid #E8E4DC', marginBottom: '3rem' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#8B9E6E', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '1rem' }}>Ressources</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 1rem' }}>
              Expertises <em style={{ color: '#8B9E6E', fontStyle: 'italic' }}>& conseils</em>
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#7A8876', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Articles rédigés par nos experts en dermatologie, cosmétologie et bien-être.
            </p>
          </div>

          {/* Grid */}
          <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }}>
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="blog-card" style={{ textDecoration: 'none' }}>
                <article style={{ background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', border: '1px solid #E8E4DC', boxShadow: '0 2px 10px rgba(28,36,32,0.05)', transition: 'box-shadow 0.2s, transform 0.2s' }}>
                  <div style={{ height: 180, background: 'linear-gradient(135deg, #EBF0E4, #F5F2EC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '4rem' }}>{article.image}</span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7A8876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <time style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#8B9E6E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{formatDate(article.date)}</time>
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600, color: '#1C2420', lineHeight: 1.35, margin: '0 0 0.75rem' }}>{article.titre}</h2>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#7A8876', lineHeight: 1.65, margin: '0 0 1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.intro}</p>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#8B9E6E' }}>Lire l&apos;article →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
      <style>{`@media (max-width: 900px) { .blog-grid { grid-template-columns: repeat(2, 1fr) !important; } } @media (max-width: 580px) { .blog-grid { grid-template-columns: 1fr !important; } } .blog-card article { transition: box-shadow 0.2s, transform 0.2s; } .blog-card:hover article { box-shadow: 0 8px 30px rgba(28,36,32,0.12) !important; transform: translateY(-3px); }`}</style>
    </>
  );
}
