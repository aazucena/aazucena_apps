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
        <aside className="flex h-full shrink-0 flex-col">
          <Sidebar />
        </aside>

        <div className="flex h-full min-w-0 flex-1 flex-col">
          <header className="border-rule bg-background z-40 flex h-14 shrink-0 items-center border-b px-6">
            <Header />
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 px-6 pb-6">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
