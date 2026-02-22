import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea, ScrollBar, Badge } from '@aazucena/ui';
import { Separator } from '@aazucena/ui';
import { Database, Terminal, Shield, Zap, Activity } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for custom scrollbars across all platforms.
 * - **Accessibility:** Built with standard ARIA roles; supports keyboard navigation and preserves native touch physics.
 * - **UX:** Features cross-browser consistent scrollbars that hide automatically when not in use.
 * - **Design:** Optimized for technical contexts like terminal outputs, metadata lists, and property sidebars.
 */
const meta = {
  title: 'Components/Primitives/ScrollArea',
  component: ScrollArea,
  subcomponents: { ScrollBar } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A custom scroll area for providing consistent cross-browser scrolling behavior and high-fidelity technical styling.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockLogs = Array.from({ length: 50 }).map((_, i) => ({
  id: `0x7F${i.toString(16).padStart(2, '0')}`,
  status: Math.random() > 0.8 ? 'FAILED' : 'STABLE',
  message: `Synchronizing node telemetry unit ${i + 1}...`,
}));

// --- STORIES ---

/**
 * Standard implementation showing a list of version tags.
 */
export const Basic: Story = {
  render: () => (
    <ScrollArea className="h-72 w-64 rounded-2xl border bg-card shadow-lg">
      <div className="p-6">
        <h4 className="mb-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
          System_Registry
        </h4>
        <div className="space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="text-sm font-bold">v1.2.0-beta.{20 - i}</div>
              <Separator className="opacity-50" />
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};

/**
 * High-performance cyber variant for technical terminals and system logs.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="bg-black p-8 rounded-2xl border border-cyan-500/10">
      <ScrollArea className="h-80 w-[500px] font-mono">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 text-cyan-500 mb-6">
            <Terminal className="size-4 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">
              // KERNEL_INGESTION_LOG
            </span>
          </div>
          {mockLogs.map((log) => (
            <div key={log.id} className="flex gap-4 text-[10px] tracking-tighter">
              <span className="opacity-20">[{new Date().toLocaleTimeString()}]</span>
              <span className={log.status === 'FAILED' ? 'text-rose-500' : 'text-cyan-400'}>
                {log.id}
              </span>
              <span className="opacity-40 uppercase">{log.status}</span>
              <span className="text-white/60 truncate">{log.message}</span>
            </div>
          ))}
        </div>
        <ScrollBar className="bg-cyan-500/5" />
      </ScrollArea>
    </div>
  ),
};

/**
 * Demonstrates horizontal scrolling for carousels or wide data tables.
 */
export const Horizontal: Story = {
  render: () => (
    <div className="w-[600px] p-8 border rounded-[2rem] bg-muted/5">
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-6 w-max px-2">
          {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'].map((name, i) => (
            <div
              key={i}
              className="w-48 h-32 bg-card border rounded-2xl p-6 flex flex-col justify-between shadow-sm"
            >
              <div className="flex justify-between items-start">
                <Database className="text-primary size-5" />
                <Badge variant="outline" size="xs">
                  UNIT_{i + 1}
                </Badge>
              </div>
              <span className="font-black uppercase tracking-tighter">{name}_Sector</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for overlays over animated backgrounds.
 */
export const GlassMonitor: Story = {
  render: () => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <ScrollArea className="h-64 w-80 glass border-white/10 rounded-2xl shadow-2xl text-white">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 opacity-60">
            <Activity className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Active_Trajectories
            </span>
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0"
            >
              <span className="text-xs font-bold">Orbit_TRJ_{i + 1}</span>
              <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
