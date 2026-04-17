import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import InfoModal from '@/components/movies/InfoModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cinway | Premium Streaming Experience',
  description: 'A visually stunning streaming platform built with Next.js and custom CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <InfoModal />
        {children}
      </body>
    </html>
  );
}
