import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Luckiest_Guy,
  Noto_Sans_KR,
  Sansita,
  Unbounded,
} from 'next/font/google';
import './globals.css';
import AppShell from './_components/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const luckiestGuy = Luckiest_Guy({
  variable: '--font-luckiest-guy', // @theme --font-luckiestguy: var(--font-luckiest-guy)
  subsets: ['latin'],
  weight: '400',
});

const notoSansKr = Noto_Sans_KR({
  variable: '--font-noto-sans-kr', // @theme --font-ko: var(--font-noto-sans-kr)
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const sansita = Sansita({
  variable: '--font-sansita-face', // @theme --font-sansita: var(--font-sansita-face)
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const unbounded = Unbounded({
  variable: '--font-unbounded-face', // @theme --font-unbounded: var(--font-unbounded-face)
  subsets: ['latin'],
  weight: ['400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'BOGGLE STUDIO',
  description: '집에서 편리하게 촬영하는 인생네컷',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    geistSans.variable,
    geistMono.variable,
    luckiestGuy.variable,
    notoSansKr.variable,
    sansita.variable,
    unbounded.variable,
  ].join(' ');

  return (
    <html lang="en" className={`${fontVars} h-full antialiased`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
