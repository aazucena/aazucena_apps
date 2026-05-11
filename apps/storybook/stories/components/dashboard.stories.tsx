import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DashboardCard,
  DashboardHeader,
  DashboardTitle,
  DashboardStatus,
  DashboardActions,
  DashboardBody,
  IconBox,
  PageTitle,
  PageSubtitle,
} from '@aazucena/ui';
import { Activity, CogFour as Settings, Refresh, Shield, Database, Zap } from '@aazucena/icons';
import { Button, Badge } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Complex layout suite for analytical interfaces.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) and specialized `dashboard` (white/zinc) presets.
 * - **UX:** Features `PageTitle` with integrated versioning and `IconBox` for semantic categorization.
 * - **Composition:** Fully modular parts (Header, Body, Actions, Status) for flexible analytical displays.
 */
const meta = {
  title: 'Components/Layout/Dashboard',
  component: DashboardCard,
  subcomponents: {
    DashboardHeader,
    DashboardTitle,
    DashboardStatus,
    DashboardActions,
    DashboardBody,
    IconBox,
    PageTitle,
    PageSubtitle,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive set of layout components for building analytical terminals and dashboards.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the dashboard card',
      table: { category: 'Appearance' },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Internal body spacing',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof DashboardCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard dashboard card implementation with navigation and status.
 */
export const BasicCard: Story = {
  args: {
    variant: 'default',
    padding: 'none',
  },
  render: (args) => (
    <DashboardCard {...args} className="w-[600px]">
      <DashboardHeader>
        <DashboardTitle>
          <IconBox variant="primary">
            <Activity size={16} />
          </IconBox>
          Systems Telemetry
        </DashboardTitle>
        <DashboardStatus>Pulse_Active</DashboardStatus>
        <DashboardActions>
          <Button variant="ghost" size="icon" className="size-8">
            <Refresh size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="size-8">
            <Settings size={14} />
          </Button>
        </DashboardActions>
      </DashboardHeader>
      <DashboardBody>
        <div className="h-48 flex items-center justify-center border-2 border-dashed border-current/10 rounded-2xl opacity-20 bg-muted/5">
          <span className="font-black text-xs uppercase tracking-widest">Visualization_Stage</span>
        </div>
      </DashboardBody>
    </DashboardCard>
  ),
};

/**
 * Full page header layout featuring versioning and high-impact typography.
 */
export const PageIdentity: Story = {
  render: () => (
    <div className="w-[800px] border-b pb-8">
      <PageTitle version="v1.4.2" variant="cyber">
        ENGINEERING_TERMINAL
      </PageTitle>
      <PageSubtitle variant="cyber">
        Real-time ingestion monitor // Node status: OPERATIONAL
      </PageSubtitle>
      <div className="flex gap-4 mt-8">
        <Badge variant="cyber" animated>
          UPLINK_LIVE
        </Badge>
        <Badge variant="outline" size="xs">
          ZONE:US_EAST_1
        </Badge>
      </div>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon glow and technical typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <DashboardCard {...args} className="w-[600px]">
      <DashboardHeader inset>
        <DashboardTitle className="text-cyan-500">
          <IconBox variant="cyber">
            <Shield size={16} />
          </IconBox>
          CORE_INTEGRITY
        </DashboardTitle>
        <DashboardStatus className="text-cyan-500/60">SYSTEM_OPERATIONAL</DashboardStatus>
      </DashboardHeader>
      <DashboardBody className="font-mono text-[10px] space-y-3 bg-black/40">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="opacity-40 uppercase">Ingestion_Buffer</span>
          <span className="text-emerald-500 font-bold">0ms</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <span className="opacity-40 uppercase">Kernel_Pulse</span>
          <span className="text-cyan-500 font-bold">STABLE</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="opacity-40 uppercase">Signal_Lock</span>
          <span className="text-primary font-bold">TRUE</span>
        </div>
      </DashboardBody>
    </DashboardCard>
  ),
};

/**
 * Immersive glass variant, ideal for overlays on complex visual backgrounds.
 */
export const GlassMonitor: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <DashboardCard {...args} className="w-[500px]">
        <DashboardHeader className="border-white/10">
          <DashboardTitle className="text-white">
            <IconBox className="bg-white/10 border-white/20 text-white">
              <Zap size={16} />
            </IconBox>
            Energy_Distribution
          </DashboardTitle>
          <DashboardStatus className="text-white/40">Real_Time</DashboardStatus>
        </DashboardHeader>
        <DashboardBody>
          <div className="h-32 flex items-end gap-1 mb-6">
            {[40, 70, 45, 90, 65, 80, 30, 50, 85, 60, 40, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-white/20 rounded-t-sm hover:bg-white/40 transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="text-[10px] font-mono text-white/60 text-center uppercase tracking-widest italic">
            Peak_Usage_Window: 14:00 - 16:00
          </p>
        </DashboardBody>
      </DashboardCard>
    </div>
  ),
};
