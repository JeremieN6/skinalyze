import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import articles from '@/skincare-spa/src/assets/data/articles.json';
import SiteHeader from '@/app/_components/site-header';
import SiteFooter from '@/app/_components/site-footer';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  return {
    title: `${article.titre} | Skinalyze Blog`,
    description: article.intro,
    openGraph: {
      title: article.titre,
      description: article.intro,
      type: 'article',
      publishedTime: article.date,
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  return (
    <>
      <SiteHeader />
      <main style={{ minHeight: '100vh', background: '#FAF8F4', paddingTop: 90 }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(160deg, #F5F2EC, #FAF8F4)', borderBottom: '1px solid #E8E4DC', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#7A8876', textDecoration: 'none', marginBottom: '1.5rem' }}>
              ← Retour au blog
            </Link>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{article.image}</div>
            <time style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#8B9E6E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>{article.date}</time>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 1.25rem' }}>{article.titre}</h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#7A8876', lineHeight: 1.75, margin: 0 }}>{article.intro}</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '3.5rem 2rem 5rem' }}>
          {article.sections.map((section, i) => (
            <section key={i} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: '#1C2420', lineHeight: 1.3, margin: '0 0 1rem', paddingTop: i > 0 ? '1rem' : 0, borderTop: i > 0 ? '1px solid #E8E4DC' : 'none' }}>{section.sous_titre}</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#3D4A3A', lineHeight: 1.8, margin: 0 }}>{section.contenu}</p>
            </section>
          ))}

          {/* CTA */}
          <div style={{ marginTop: '3rem', padding: '2.5rem', background: 'linear-gradient(135deg, #EBF0E4, #F5F2EC)', borderRadius: 20, textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#1C2420', margin: '0 0 0.75rem' }}>Prêt à analyser votre peau ?</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#7A8876', lineHeight: 1.65, margin: '0 0 1.5rem' }}>Obtenez votre diagnostic personnalisé en 60 secondes, gratuitement.</p>
            <Link href="/diagnostic" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #8B9E6E, #6B7C54)', padding: '0.85rem 2rem', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 16px #8B9E6E40' }}>
              Tester gratuitement →
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
