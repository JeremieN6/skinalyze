import Link from 'next/link';
import { Metadata } from 'next';
import articles from '@/skincare-spa/src/assets/data/articles.json';
import SiteHeader from '@/app/_components/site-header';
import SiteFooter from '@/app/_components/site-footer';

export const metadata: Metadata = {
  title: 'Blog Skincare — Conseils peau & beauté | Skinalyze',
  description: 'Découvrez nos articles sur les soins de la peau, les routines beauté et les dernières innovations cosmétiques.',
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ minHeight: '100vh', background: '#FAF8F4', paddingTop: 90, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
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
          <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {articles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="blog-card" style={{ textDecoration: 'none' }}>
                <article style={{ background: '#FFFFFF', borderRadius: 20, overflow: 'hidden', border: '1px solid #E8E4DC', boxShadow: '0 2px 10px rgba(28,36,32,0.05)', transition: 'box-shadow 0.2s, transform 0.2s' }}>
                  <div style={{ height: 180, background: 'linear-gradient(135deg, #EBF0E4, #F5F2EC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '4rem' }}>{article.image}</span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <time style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#8B9E6E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>{article.date}</time>
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
      <style>{`@media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr !important; } } .blog-card article { transition: box-shadow 0.2s, transform 0.2s; } .blog-card:hover article { box-shadow: 0 8px 30px rgba(28,36,32,0.12) !important; transform: translateY(-3px); }`}</style>
    </>
  );
}
