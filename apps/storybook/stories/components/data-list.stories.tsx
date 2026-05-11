import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DataList,
  DataListHeader,
  DataListTitle,
  DataListSubtitle,
  DataListTable,
  DataListRow,
  DataListCell,
  DataListProgress,
  DataListGrid,
  DataListItem,
  DataListLabel,
  DataListValue,
} from '@aazucena/ui';
import { Badge } from '@aazucena/ui';
import { Activity, Globe, Zap, Database } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Layout suite for high-density analytical lists and tabular metadata.
 * - **UX:** Features specialized components for Ranking, Progress tracking, and Grid-based distribution.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) and analytical `transparent` presets.
 * - **Composition:** Fully modular parts (Header, Table, Row, Cell, Grid, Item) for flexible data displays.
 */
const meta = {
  title: 'Components/Data/DataList',
  component: DataList,
  subcomponents: {
    DataListHeader,
    DataListTitle,
    DataListSubtitle,
    DataListTable,
    DataListRow,
    DataListCell,
    DataListProgress,
    DataListGrid,
    DataListItem,
    DataListLabel,
    DataListValue,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive suite of components for displaying structured data in tabular or grid formats. Optimized for analytical dashboards and terminal views.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'transparent'],
      description: 'The visual theme of the data list container',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof DataList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSignals = [
  { id: '01', name: 'CORE_KERNEL_UPLINK', origin: 'US_EAST_1', status: 'ACTIVE', load: 92 },
  { id: '02', name: 'SIGNAL_TRACER_v2', origin: 'EU_WEST_2', status: 'STABLE', load: 45 },
  { id: '03', name: 'BINARY_PULSE_SYNC', origin: 'AP_SOUTH_1', status: 'WAITING', load: 12 },
];

/**
 * Full tabular implementation for leaderboards or signal logs.
 */
export const LeaderboardTable: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <DataList {...args} className="w-[800px]">
      <DataListHeader>
        <div className="flex flex-col">
          <DataListTitle>Signal_Intelligence_Stream</DataListTitle>
          <DataListSubtitle>High-Priority Node Processing</DataListSubtitle>
        </div>
        <Badge variant="outline" animated>
          LIVE_UPLINK
        </Badge>
      </DataListHeader>
      <DataListTable>
        <thead>
          <DataListRow className="bg-transparent hover:bg-transparent">
            <DataListCell type="rank">ID</DataListCell>
            <DataListCell type="detail">Component</DataListCell>
            <DataListCell type="metric">Origin_Node</DataListCell>
            <DataListCell type="visual">Buffer_Load</DataListCell>
          </DataListRow>
        </thead>
        <tbody>
          {mockSignals.map((signal) => (
            <DataListRow key={signal.id}>
              <DataListCell type="rank">#{signal.id}</DataListCell>
              <DataListCell type="detail">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'size-2 rounded-full',
                      signal.load > 80 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500',
                    )}
                  />
                  <div>
                    <div className="font-bold text-xs uppercase">{signal.name}</div>
                    <div className="text-[9px] opacity-40 font-mono italic">
                      STATE: {signal.status}
                    </div>
                  </div>
                </div>
              </DataListCell>
              <DataListCell type="metric">{signal.origin}</DataListCell>
              <DataListCell type="visual">
                <DataListProgress value={signal.load} label={`${signal.load}%`} />
              </DataListCell>
            </DataListRow>
          ))}
        </tbody>
      </DataListTable>
    </DataList>
  ),
};

/**
 * High-performance cyber variant with neon glow and technical grid distribution.
 */
export const CyberGrid: Story = {
  render: () => (
    <div className="w-[850px] space-y-8">
      <div className="flex flex-col px-2">
        <div className="flex items-center gap-3 mb-6">
          <IconBox variant="cyber" size="sm">
            <Activity size={14} />
          </IconBox>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">
            GEO_DISTRIBUTION_PROTOCOLS
          </h3>
        </div>
        <DataListGrid cols={4} gap="lg">
          <DataListItem variant="cyber">
            <div className="flex flex-col gap-1">
              <DataListLabel className="text-cyan-500/40">US_CLUSTER</DataListLabel>
              <DataListValue className="text-cyan-400">42.8%</DataListValue>
            </div>
            <Globe className="size-4 text-cyan-500/20" />
          </DataListItem>
          <DataListItem variant="cyber">
            <div className="flex flex-col gap-1">
              <DataListLabel className="text-cyan-500/40">DE_CLUSTER</DataListLabel>
              <DataListValue className="text-cyan-400">18.2%</DataListValue>
            </div>
            <Database className="size-4 text-cyan-500/20" />
          </DataListItem>
          <DataListItem variant="cyber">
            <div className="flex flex-col gap-1">
              <DataListLabel className="text-cyan-500/40">JP_CLUSTER</DataListLabel>
              <DataListValue className="text-cyan-400">15.1%</DataListValue>
            </div>
            <Zap className="size-4 text-cyan-500/20" />
          </DataListItem>
          <DataListItem variant="cyber">
            <div className="flex flex-col gap-1">
              <DataListLabel className="text-cyan-500/40">TOTAL_REACH</DataListLabel>
              <DataListValue className="text-cyan-400">GLOBAL</DataListValue>
            </div>
            <Globe className="size-4 text-cyan-500/20" />
          </DataListItem>
        </DataListGrid>
      </div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for overlays on complex visual backgrounds.
 */
export const GlassDisplay: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <DataList {...args} className="w-[600px] border-white/10 shadow-2xl">
        <DataListHeader className="border-white/10 bg-white/5">
          <DataListTitle className="text-white">Active_Trajectories</DataListTitle>
          <DataListSubtitle className="text-white/40">Prediction_Engine_v4</DataListSubtitle>
        </DataListHeader>
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center text-white/80">
            <span className="text-[10px] font-black uppercase tracking-widest">Inference_Load</span>
            <DataListProgress value={65} label="65%" className="text-white" />
          </div>
          <div className="flex justify-between items-center text-white/80">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Network_Stability
            </span>
            <DataListProgress value={98} label="98%" className="text-white" />
          </div>
        </div>
      </DataList>
    </div>
  ),
};

// Helper for stories
const cn = (...args: any[]) => args.filter(Boolean).join(' ');
const IconBox = ({ children, variant, size }: any) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-lg border',
      variant === 'cyber'
        ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500'
        : 'bg-muted border-border',
      size === 'sm' ? 'size-8' : 'size-10',
    )}
  >
    {children}
  </div>
);
