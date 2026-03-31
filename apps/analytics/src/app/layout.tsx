import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';

// 1. Providers
import { RootProvider } from '@/providers/RootProvider';

// 2. Core Layout Components
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { CommandPalette } from '@/components/common/CommandPalette';
import { AuthGate } from '@/components/common/AuthGate';

// 3. Fonts: Inter for UI, JetBrains Mono for Data/Telemetry
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'AZUCENA_LYTICS // Core_Terminal',
  description: 'Systems Telemetry & Engineering Intelligence Terminal',
  icons: {
    icon: '/favicon-alt.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mono.variable} font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased`}
      >
        <RootProvider>
          <AuthGate />
          <CommandPalette />
          <div className="flex h-screen w-full overflow-hidden">
            {/* LEFT: Fixed Sidebar Navigation */}
            <aside className="flex flex-col shrink-0 h-full">
              <Sidebar />
            </aside>

            {/* RIGHT: Main Content Section */}
            <div className="flex flex-col flex-1 min-w-0 h-full">
              {/* TOP: Fixed Header / Status Bar */}
              <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md flex items-center px-6 shrink-0 z-40">
                <Header />
              </header>

              {/* CENTER: Scrollable Application Content */}
              <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 hover:scrollbar-thumb-zinc-300 dark:hover:scrollbar-thumb-zinc-700">
                <div className="p-8 max-w-7xl mx-auto">{children}</div>
              </main>
            </div>
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
