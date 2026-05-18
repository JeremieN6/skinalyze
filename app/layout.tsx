import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skinalyze — Analyse de peau par IA en 60 secondes',
  description:
    'Offrez à chaque client un diagnostic peau personnalisé en 60 secondes. Co-analysé par dermatologue, cosmétologue et coach bien-être. Solution B2B pour instituts de beauté, spas et marques cosmétiques.',
  robots: 'index, follow',
  openGraph: {
    title: 'Skinalyze — Diagnostic peau IA en 60 secondes | Solution B2B',
    description:
      'La solution B2B pour les instituts et spas qui veulent proposer un diagnostic de peau par IA en 60 secondes et mieux convertir en prestations et produits.',
    url: 'https://skinalyze.nanocorp.app',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: 'https://skinalyze.nanocorp.app/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skinalyze — Diagnostic peau IA en 60 secondes',
    description:
      'La solution B2B pour les instituts et spas qui veulent proposer un diagnostic de peau par IA en 60 secondes.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
