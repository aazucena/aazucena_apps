import { AuthGate } from '@/components/common/AuthGate';
import { CommandPalette } from '@/components/common/CommandPalette';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
