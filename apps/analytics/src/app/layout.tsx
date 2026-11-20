import type { Metadata } from 'next';
import { Fira_Code, Fira_Sans } from 'next/font/google';
import '../styles/globals.css';

import { RootProvider } from '@/providers/RootProvider';

const sans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

const mono = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const themeInit = `try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light')}catch(e){document.documentElement.classList.add('dark')}`;

export const metadata: Metadata = {
  title: 'AZUCENA_LYTICS // Core_Terminal',
  description: 'Systems Telemetry & Engineering Intelligence Terminal',
  icons: {
    icon: '/favicon-alt.svg',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
