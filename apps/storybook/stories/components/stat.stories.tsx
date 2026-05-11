import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Stat,
  StatValue,
  StatLabel,
  StatDescription,
  StatIcon,
  StatBoard,
  StatBoardGrid,
  StatBoardHeader,
} from '@aazucena/ui';
import { Trend } from '@aazucena/ui';
import {
  Activity,
  Database,
  Globe,
  Shield,
  Zap,
  DollarCircle as Dollar,
  Users,
  Refresh,
} from '@aazucena/icons';
import { Badge, Button } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout suite for displaying quantitative technical data and KPIs.
 * - **UX:** Features specialized `StatValue` variants with support for gradient text and mono-typography.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for high-fidelity icons and trend indicators.
 * - **Composition:** Fully modular parts (Icon, Label, Value, Description) for assembling flexible data tiles.
 */
const meta = {
  title: 'Components/Data/Stat',
  component: Stat,
  subcomponents: {
    StatValue,
    StatLabel,
    StatDescription,
    StatIcon,
    StatBoard,
    StatBoardGrid,
    StatBoardHeader,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A suite of components for displaying data metrics, key performance indicators, and technical readouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'card', 'glass', 'cyber'],
      description: 'The visual theme of the stat container',
      table: { category: 'Appearance' },
    },
    alignment: {
      control: 'radio',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of content',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for a simple metric readout.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    alignment: 'left',
  },
  render: (args) => (
    <Stat {...args} className="w-64">
      <StatLabel>Memory_Usage</StatLabel>
      <StatValue size="lg">4.2 GB</StatValue>
      <StatDescription>Total_Capacity: 16GB</StatDescription>
    </Stat>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="p-12 bg-black border border-cyan-500/10 rounded-[3rem]">
      <Stat {...args} className="w-64">
        <div className="flex justify-between items-start mb-6">
          <StatIcon variant="cyber" size="sm">
            <Zap className="size-5 text-cyan-500" />
          </StatIcon>
          <Badge variant="cyber" size="xs">
            STABLE
          </Badge>
        </div>
        <StatLabel variant="cyber">KERNEL_PULSE</StatLabel>
        <StatValue variant="cyber" size="xl">
          99.9%
        </StatValue>
        <StatDescription variant="success">INBOUND_SIGNALS_VERIFIED</StatDescription>
      </Stat>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for overlays on complex backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <div className="w-64">
        <Stat {...args}>
          <div className="flex items-center gap-3 mb-4 opacity-60">
            <Globe className="size-5 text-white" />
            <StatLabel variant="glass" className="mb-0">
              Global_Reach
            </StatLabel>
          </div>
          <StatValue className="text-white text-5xl">14.2K</StatValue>
          <StatDescription className="text-white/40 font-bold mt-2 tracking-widest uppercase">
            Nodes_Active
          </StatDescription>
        </Stat>
      </div>
    </div>
  ),
};

/**
 * Full implementation of a statistics board with integrated trends and headers.
 */
export const DashboardBoard: Story = {
  render: () => (
    <div className="w-[900px]">
      <StatBoard>
        <StatBoardHeader>
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tighter uppercase">Cluster_Inference</h3>
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.3em]">
              Real-time node analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Refresh size={14} />
            </Button>
            <Button size="sm" className="rounded-full">
              Export_Intel
            </Button>
          </div>
        </StatBoardHeader>
        <StatBoardGrid>
          <Stat variant="default" className="border-r pr-8 last:border-0">
            <StatLabel>INGESTION_RATE</StatLabel>
            <StatValue variant="primary">450/s</StatValue>
            <Trend direction="up" value="12%" className="mt-2" />
          </Stat>
          <Stat variant="default" className="border-r px-8 last:border-0">
            <StatLabel>STABILITY_INDEX</StatLabel>
            <StatValue variant="success">99.98%</StatValue>
            <Trend direction="neutral" value="STABLE" className="mt-2" />
          </Stat>
          <Stat variant="default" className="pl-8">
            <StatLabel>ERROR_VECTORS</StatLabel>
            <StatValue variant="rose">0.02%</StatValue>
            <Trend direction="down" value="-0.1%" className="mt-2" />
          </Stat>
        </StatBoardGrid>
      </StatBoard>
    </div>
  ),
};
