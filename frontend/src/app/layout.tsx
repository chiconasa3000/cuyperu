import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/layout/WhatsAppWidget';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  title: {
    default: 'CuyPeru | Carne de Cuy Premium',
    template: '%s | CuyPeru',
  },
  description:
    'La mejor carne de cuy peruano: comercial, mediano, grande, deshuesado y gourmet. Criado de forma natural, entregado fresco a tu puerta.',
  keywords: ['cuy', 'carne de cuy', 'cuy peruano', 'cuy al horno', 'cuy gourmet', 'cuy fresco'],
  applicationName: 'CuyPeru',
  authors: [{ name: 'CuyPeru' }],
  category: 'comida',
  openGraph: {
    title: 'CuyPeru | Carne de Cuy Premium',
    description:
      'La mejor carne de cuy peruano, criado de forma natural y entregado fresco.',
    url: '/',
    siteName: 'CuyPeru',
    type: 'website',
    locale: 'es_PE',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'CuyPeru - Carne de cuy premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CuyPeru | Carne de Cuy Premium',
    description:
      'La mejor carne de cuy peruano, criado de forma natural y entregado fresco.',
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/',
    languages: { 'es-PE': '/' },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}