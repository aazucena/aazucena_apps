import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Kanban,
  KanbanBoard,
  KanbanCard,
  KanbanContent,
  KanbanHeader,
  KanbanLane,
} from '@aazucena/ui';
import { Badge, Button, Avatar, AvatarFallback } from '@aazucena/ui';
import {
  Activity,
  CogFour as Settings,
  Plus,
  Dots as MoreHorizontal,
  Shield,
  Zap,
} from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for project management and technical task tracking.
 * - **UX:** Features smooth horizontal "Board" scrolling with click-and-drag panning support.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for high-impact card elevation.
 * - **Responsiveness:** Automatically adapts lane width for mobile vs desktop viewing.
 * - **Composition:** Fully modular parts (Board, Lane, Header, Content, Card) for flexible board assembly.
 */
const meta = {
  title: 'Components/Layout/Kanban',
  component: Kanban,
  subcomponents: {
    KanbanBoard,
    KanbanLane,
    KanbanHeader,
    KanbanContent,
    KanbanCard,
  } as any,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full-featured Kanban board system. Supports multiple lanes, drag-to-scroll, and high-fidelity technical task cards.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber'],
      description: 'The visual theme of the board',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Kanban>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard project management implementation with multiple status lanes.
 */
export const Basic: Story = {
  render: () => (
    <div className="h-[600px] w-full bg-panel dark:bg-background border m-10 rounded-card overflow-hidden">
      <Kanban>
        <div className="p-8 border-b flex justify-between items-center bg-panel-raised dark:bg-panel">
          <h2 className="text-2xl font-black tracking-tighter uppercase">Project_Timeline</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              Filter
            </Button>
            <Button size="sm" className="rounded-full">
              New_Task
            </Button>
          </div>
        </div>
        <KanbanBoard>
          <KanbanLane>
            <KanbanHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[10px] uppercase tracking-widest opacity-40">
                    To_Do
                  </span>
                  <Badge variant="secondary" size="xs">
                    3
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="size-6">
                  <Plus size={14} />
                </Button>
              </div>
            </KanbanHeader>
            <KanbanContent>
              <KanbanCard>
                <h4 className="text-xs font-bold mb-3 uppercase tracking-tight">
                  Optimize_ClickHouse_Ingestion
                </h4>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" size="xs">
                    HIGH_PRIO
                  </Badge>
                  <Avatar className="size-5">
                    <AvatarFallback className="text-[8px]">AA</AvatarFallback>
                  </Avatar>
                </div>
              </KanbanCard>
              <KanbanCard>
                <h4 className="text-xs font-bold mb-3 uppercase tracking-tight">
                  Refactor_Design_Tokens
                </h4>
                <Badge variant="outline" size="xs">
                  PHASE_4
                </Badge>
              </KanbanCard>
            </KanbanContent>
          </KanbanLane>

          <KanbanLane className="bg-primary/5 border-primary/10">
            <KanbanHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[10px] uppercase tracking-widest text-primary">
                    In_Progress
                  </span>
                  <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            </KanbanHeader>
            <KanbanContent>
              <KanbanCard className="border-primary/20 shadow-primary/5">
                <h4 className="text-xs font-bold mb-3 uppercase tracking-tight text-primary">
                  Establish_Uplink_Protocols
                </h4>
                <p className="text-[10px] opacity-60 mb-4 italic">
                  Defining secure node handshake sequence.
                </p>
                <div className="flex -space-x-2">
                  <Avatar className="size-5 border-2 border-background">
                    <AvatarFallback className="text-[8px]">U1</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-5 border-2 border-background">
                    <AvatarFallback className="text-[8px]">U2</AvatarFallback>
                  </Avatar>
                </div>
              </KanbanCard>
            </KanbanContent>
          </KanbanLane>

          <KanbanLane>
            <KanbanHeader>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-black text-[10px] uppercase tracking-widest opacity-40">
                  Validation
                </span>
              </div>
            </KanbanHeader>
            <KanbanContent>
              <KanbanCard className="opacity-40 grayscale">
                <h4 className="text-xs font-bold uppercase tracking-tight line-through">
                  Fix_Preloader_Lag
                </h4>
              </KanbanCard>
            </KanbanContent>
          </KanbanLane>
        </KanbanBoard>
      </Kanban>
    </div>
  ),
};

/**
 * High-performance cyber variant for technical incident tracking.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="h-[500px] w-full bg-background border border-signal/10 m-10 rounded-card overflow-hidden">
      <Kanban {...args}>
        <div className="p-6 border-b border-signal/10 bg-signal/5">
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-signal animate-pulse" />
            <span className="font-mono text-xs text-signal italic uppercase">
              // INCIDENT_TRACKER_v2
            </span>
          </div>
        </div>
        <KanbanBoard>
          <KanbanLane variant="cyber">
            <KanbanHeader>
              <h3 className="font-mono text-[10px] text-signal uppercase tracking-[0.2em] mb-4">
                # SECTOR_0x7F
              </h3>
            </KanbanHeader>
            <KanbanContent>
              <KanbanCard className="bg-signal/5 border-signal/20 text-signal group hover:border-signal">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-[11px] font-mono font-black uppercase text-signal">
                    KERNEL_SYNC_ERROR
                  </h4>
                  <Shield size={14} className="text-alert" />
                </div>
                <p className="text-[9px] font-mono opacity-40 uppercase">
                  Trace: BUFFER_OVERFLOW_01
                </p>
              </KanbanCard>
              <KanbanCard className="bg-signal/5 border-signal/20 text-signal group hover:border-signal">
                <h4 className="text-[11px] font-mono font-black uppercase text-signal">
                  PULSE_LAG_DETECTION
                </h4>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="cyber" size="xs">
                    MONITORING
                  </Badge>
                  <span className="font-mono text-[9px] text-signal/40">Lat: 142ms</span>
                </div>
              </KanbanCard>
            </KanbanContent>
          </KanbanLane>

          <KanbanLane variant="cyber" className="opacity-40">
            <KanbanHeader>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4">
                # ARCHIVE_READ
              </h3>
            </KanbanHeader>
            <KanbanContent>
              <KanbanCard className="bg-state border-rule text-foreground font-mono">
                <h4 className="text-[11px] font-black uppercase line-through">AUTH_BYPASS_FIX</h4>
              </KanbanCard>
            </KanbanContent>
          </KanbanLane>
        </KanbanBoard>
      </Kanban>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric layers.
 */
export const GlassBoard: Story = {
  render: () => (
    <div className="h-[600px] w-full p-10 overflow-hidden relative">
      <div className="absolute inset-0 bg-scrim" />
      <Kanban className="h-full relative z-10">
        <KanbanBoard className="h-full">
          {['Alpha_Layer', 'Beta_Layer', 'Gamma_Layer'].map((layer, i) => (
            <KanbanLane key={i} variant="glass" className="h-full border-rule bg-state">
              <KanbanHeader className="border-b border-rule pb-6 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-foreground font-black uppercase tracking-tighter text-xl">
                    {layer}
                  </h3>
                  <Zap className="size-4 text-signal animate-pulse" />
                </div>
              </KanbanHeader>
              <KanbanContent>
                {Array.from({ length: 3 }).map((_, j) => (
                  <KanbanCard
                    key={j}
                    className="bg-state border-rule text-foreground shadow-none hover:bg-panel-raised transition-colors"
                  >
                    <h4 className="text-sm font-bold opacity-90">Telemetry_Unit_0{j + 1}</h4>
                    <p className="text-[10px] text-foreground/40 mt-2 uppercase tracking-widest font-mono">
                      Status: Syncing...
                    </p>
                  </KanbanCard>
                ))}
              </KanbanContent>
            </KanbanLane>
          ))}
        </KanbanBoard>
      </Kanban>
    </div>
  ),
};
