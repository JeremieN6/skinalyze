import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import articlesData from '@/skincare-spa/src/assets/data/articles.json';
import SiteHeader from '@/app/_components/site-header';
import SiteFooter from '@/app/_components/site-footer';

const articles = articlesData;

function formatDate(iso: string) {
  const MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MOIS[m - 1]} ${y}`;
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
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

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <>
      <SiteHeader />
      <main style={{ minHeight: '100vh', background: '#FAF8F4', paddingTop: 90 }}>
        <div style={{ maxWidth: 800, margin: '0px auto', width: '100%', padding: '3rem 2rem 6rem' }}>

          {/* Back */}
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#7A8876', textDecoration: 'none', marginBottom: '2rem' }}>
            ← Retour au blog
          </Link>

          {/* Emoji card */}
          <div style={{ background: 'linear-gradient(135deg, #EBF0E4, #F5F2EC)', borderRadius: 20, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid #E8E4DC' }}>
            <span style={{ fontSize: '5rem' }}>{article!.image}</span>
          </div>

          {/* Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7A8876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <time style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#8B9E6E', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{formatDate(article!.date)}</time>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: '#1C2420', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 1.25rem' }}>{article!.titre}</h1>

          {/* Intro */}
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#7A8876', lineHeight: 1.75, margin: '0 0 2rem' }}>{article!.intro}</p>

          {/* Divider */}
          <div style={{ height: 2, background: 'linear-gradient(90deg, rgb(139, 158, 110) 0%, transparent 100%)', borderRadius: 1, marginBottom: '3rem', width: 80 }}></div>
          
          {/* Sections */}
          {article!.sections.map((section, i) => (
            <section key={i} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#1C2420', lineHeight: 1.3, margin: '0 0 0.9rem' }}>{section.sous_titre}</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#3D4A3A', lineHeight: 1.8, margin: 0 }}>{section.contenu}</p>
            </section>
          ))}

          {/* CTA */}
          <div style={{ marginTop: '3rem', padding: '2.5rem', background: 'linear-gradient(135deg, rgb(107, 124, 84) 0%, rgb(28, 36, 32) 100%)', borderRadius: 20, textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 0.75rem' }}>Obtenez votre diagnostic personnalisé en 60 secondes</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 1.75rem', lineHeight: 1.65 }}>
              Lancez un diagnostic guidé ou réservez une démo pour découvrir comment Skinalyze s&apos;intègre dans le parcours client de votre institut.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/diagnostic" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', fontWeight: 600, color: 'black', background: 'white', padding: '0.8rem 1.6rem', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 16px #8B9E6E50' }}>
                <span>🔬</span>
                Lancer un diagnostic
              </Link>
              <Link href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', fontWeight: 600, color: '#D4E0CC', background: 'transparent', padding: '0.8rem 1.6rem', borderRadius: 50, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                Demander une démo
              </Link>
            </div>
          </div>

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
