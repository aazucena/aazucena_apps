import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shell, ShellSidebar, ShellView, ShellHeader, ShellMain, ShellContent } from '@aazucena/ui';
import { Button, IconBox, Logo, Badge, Avatar, AvatarFallback } from '@aazucena/ui';
import {
  Activity,
  Layout,
  CogFour as Settings,
  User,
  Search,
  Zap,
  Database,
  Shield,
} from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral root layout suite for assembling entire application interfaces.
 * - **Responsiveness:** Features a specialized sidebar-view split with integrated scroll-management for the main viewport.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `backdrop-blur` and dynamic border tokens.
 * - **Composition:** Fully modular parts (Sidebar, View, Header, Main, Content) for tailorable app architecture.
 */
const meta = {
  title: 'Components/Containers/Shell',
  component: Shell,
  subcomponents: {
    ShellSidebar,
    ShellView,
    ShellHeader,
    ShellMain,
    ShellContent,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The root application layout system. Manages primary navigation sidebars, persistent headers, and the main scrollable content area.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the overall application shell',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Shell>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a full sidebar-driven dashboard.
 */
export const BasicDashboard: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Shell {...args}>
      <ShellSidebar className="w-72 bg-card border-r border-border p-8">
        <div className="mb-16">
          <Logo size="lg" />
        </div>
        <nav className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 rounded-xl gap-4 bg-accent/50"
          >
            <Layout size={20} /> <span className="font-bold tracking-tight">Overview</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 rounded-xl gap-4 opacity-60">
            <Activity size={20} /> <span className="font-bold tracking-tight">Analytics</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 rounded-xl gap-4 opacity-60">
            <Database size={20} /> <span className="font-bold tracking-tight">Node_Registry</span>
          </Button>
        </nav>
        <div className="mt-auto pt-8 border-t">
          <div className="flex items-center gap-4 mb-8 px-2">
            <Avatar className="size-10">
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold">Aldrin_Azucena</span>
              <span className="text-[10px] opacity-40 uppercase font-black">Level_01_Admin</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-12 rounded-full font-black uppercase tracking-widest text-[10px]"
          >
            <Settings size={16} /> SYSTEM_SETTINGS
          </Button>
        </div>
      </ShellSidebar>
      <ShellView>
        <ShellHeader className="justify-between px-10">
          <div className="flex items-center gap-4">
            <Badge variant="outline" animated>
              UPLINK_STABLE
            </Badge>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Primary_Cluster_US_East
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search size={18} />
            </Button>
            <Button size="sm" className="rounded-full px-6">
              New_Deployment
            </Button>
          </div>
        </ShellHeader>
        <ShellMain>
          <ShellContent maxWidth="7xl">
            <div className="space-y-12">
              <div className="h-40 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 flex flex-col justify-center px-12 gap-2">
                <h1 className="text-5xl font-black tracking-tighter uppercase">
                  Intelligence_Center
                </h1>
                <p className="text-xs font-medium uppercase tracking-widest text-primary/60">
                  Node Management & Telemetry Ingestion
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-64 rounded-[2.5rem] bg-card border border-border/50 flex items-center justify-center opacity-20 border-dashed"
                  >
                    <span className="font-black uppercase tracking-widest text-xs">
                      Module_Slot_0{i}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ShellContent>
        </ShellMain>
      </ShellView>
    </Shell>
  ),
};

/**
 * High-performance cyber variant for technical terminals and system monitors.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <Shell {...args}>
      <ShellSidebar className="w-20 bg-black border-r border-cyan-500/20 flex flex-col items-center py-10 gap-10">
        <IconBox variant="cyber" size="md">
          <Activity size={20} />
        </IconBox>
        <IconBox variant="default" size="md" className="opacity-20">
          <Shield size={20} />
        </IconBox>
        <IconBox variant="default" size="md" className="opacity-20">
          <Zap size={20} />
        </IconBox>
        <div className="mt-auto">
          <IconBox variant="default" size="md" className="opacity-20">
            <Settings size={20} />
          </IconBox>
        </div>
      </ShellSidebar>
      <ShellView>
        <ShellHeader variant="cyber" className="justify-between px-8 border-cyan-500/10">
          <div className="flex items-center gap-4">
            <span className="font-mono text-cyan-500 italic uppercase text-[10px] tracking-widest">
              // AAZUCENA_LYTICS_v1.4
            </span>
            <div className="size-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </div>
          <span className="font-mono text-[9px] text-cyan-500/40 uppercase">
            ENCLAVE_AUTH: VERIFIED
          </span>
        </ShellHeader>
        <ShellMain className="bg-zinc-950">
          <div className="p-12 font-mono text-cyan-500/60 text-[11px] leading-loose">
            <p className="text-cyan-400 font-bold uppercase mb-4 text-sm">
              {'>'} SYSTEM_INITIALIZATION_COMPLETE
            </p>
            <p className="opacity-40 italic">-- established node handshake US_EAST_01 --</p>
            <p className="opacity-40 italic">-- synchronized buffer [SIZE: 1024MB] --</p>
            <p className="opacity-40 italic">-- security keys rotated successfully --</p>
            <p className="mt-8 text-cyan-400">{'>'} AWAITING_INGESTION_COMMAND_</p>
          </div>
        </ShellMain>
      </ShellView>
    </Shell>
  ),
};
