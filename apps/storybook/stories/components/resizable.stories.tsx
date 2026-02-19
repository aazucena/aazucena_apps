import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@aazucena/ui';
import { Terminal, Layout, Activity, Database, Globe } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Fluid panel primitive built on `react-resizable-panels`.
 * - **UX:** Features click-and-drag handles with optional visual "Grip" indicators. Supports persistence via `autoSaveId`.
 * - **Design:** Optimized for complex technical layouts like IDEs, dashboard sidebars, and analytical monitors.
 * - **Composition:** Fully modular parts (Group, Panel, Handle) for tailorable layout distribution.
 */
const meta = {
  title: 'Components/Layout/Resizable',
  component: ResizablePanelGroup,
  subcomponents: { ResizablePanel, ResizableHandle } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust layout system for creating resizable multi-panel interfaces. Supports horizontal and vertical orientations with high-fidelity technical styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The primary axis of the panel group',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard horizontal implementation, ideal for sidebar + main content patterns.
 */
export const Basic: Story = {
  args: {
    direction: 'horizontal',
  },
  render: (args) => (
    <div className="h-[400px] w-[800px] rounded-[2rem] border overflow-hidden shadow-2xl bg-card">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="flex h-full flex-col gap-4 p-6 bg-muted/20">
            <div className="flex items-center gap-2 opacity-40">
              <Layout size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Navigation</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-2/3 bg-current/10 rounded" />
              <div className="h-2 w-1/2 bg-current/10 rounded" />
              <div className="h-2 w-3/4 bg-current/10 rounded" />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Activity className="size-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase">Main_Stage_Area</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Primary visualization and telemetry processing environment.
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * High-performance cyber variant for technical terminals and system monitors.
 */
export const TechnicalIDE: Story = {
  render: () => (
    <div className="h-[500px] w-[900px] bg-black border border-cyan-500/10 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex h-full flex-col p-4 border-r border-white/5">
            <span className="font-mono text-[9px] text-cyan-500 opacity-40 uppercase mb-4">
              Files_Expl
            </span>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-cyan-500/60 font-mono text-[10px]"
                >
                  <Database size={12} /> NODE_0{i}.LOG
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="bg-white/5" />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <div className="flex h-full items-center justify-center p-6 font-mono text-cyan-400 text-xs">
                <div className="flex items-center gap-3">
                  <Terminal className="animate-pulse" />
                  <span>// UPLINK_CORE_STABLE_0x7F42</span>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle className="bg-white/5" withHandle />
            <ResizablePanel defaultSize={30}>
              <div className="flex h-full flex-col p-4 bg-cyan-500/5">
                <span className="font-mono text-[9px] text-cyan-500 opacity-40 uppercase mb-2">
                  Diagnostic_Console
                </span>
                <p className="font-mono text-[10px] text-emerald-500/80">
                  {'>'} ALL_SYSTEMS_NOMINAL
                </p>
                <p className="font-mono text-[10px] text-cyan-500/40 mt-1">
                  {'>'} Waiting for signal sync...
                </p>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Demonstrates a complex three-column layout.
 */
export const ThreeColumn: Story = {
  render: () => (
    <div className="h-[300px] w-[900px] border rounded-2xl overflow-hidden shadow-xl bg-card">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} className="bg-muted/30">
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-[10px] font-bold uppercase opacity-40">Sidebar_L</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-[10px] font-bold uppercase">Main_Center_Content</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} className="bg-muted/30">
          <div className="flex h-full items-center justify-center p-4">
            <span className="text-[10px] font-bold uppercase opacity-40">Sidebar_R</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
