import SiteHeader from './site-header';
import SiteFooter from './site-footer';
import styles from '../_styles/legal.module.css';

export default function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#FAF8F4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />
      <main style={{ flex: 1, paddingTop: 96, paddingBottom: '5rem' }}>
        <div className={styles.container}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.content}>{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
