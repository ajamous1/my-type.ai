import './globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MyType.ai - Your Font Assistant',
  description: 'Discover, pair, and customize fonts with AI assistance',
  openGraph: {
    title: 'MyType.ai - Your Font Assistant',
    description: 'Discover, pair, and customize fonts with AI assistance',
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
    title: 'MyType.ai - Your Font Assistant',
    description: 'Discover, pair, and customize fonts with AI assistance',
    images: ['/assets/elements/img-metadata.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
