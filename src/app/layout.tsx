import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MyType - Discover and use Type',
  description: 'MyType is an AI-powered typography tool that identifies, analyzes, and visualizes fonts to help designers make smarter typographic decisions.',
  openGraph: {
    title: 'MyType - Discover and use Type',
    description: 'MyType is an AI-powered typography tool that identifies, analyzes, and visualizes fonts to help designers make smarter typographic decisions.',
    images: [
      {
        url: '/assets/elements/img-metadata.png',
        width: 1200,
        height: 630,
        alt: 'MyType.ai Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyType - Discover and use Type',
    description: 'MyType is an AI-powered typography tool that identifies, analyzes, and visualizes fonts to help designers make smarter typographic decisions.',
    images: ['/assets/elements/img-metadata.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body className={inter.variable}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
