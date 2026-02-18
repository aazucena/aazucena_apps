import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  InfoBlock,
  InfoBlockActions,
  InfoBlockContent,
} from '@aazucena/ui';
import { Button, Badge } from '@aazucena/ui';
import { Activity, Shield, Zap, Globe, Refresh, ChevronRight, CheckCircle } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite horizontal layout component for inline status and quick actions.
 * - **UX:** Optimized for scanning large lists of services or resources with high-contrast icons and labels.
 * - **Variants:** Supports semantic presets (`success`, `warning`, `primary`) and high-fidelity `cyber`.
 * - **Composition:** Modular parts (Content, Actions) for flexible horizontal distribution.
 */
const meta = {
  title: 'Components/Data/InfoBlock',
  component: InfoBlock,
  subcomponents: { InfoBlockContent, InfoBlockActions } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A compact informational strip used for displaying service status, resource metadata, or quick system notices.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'cyber'],
      description: 'The visual theme and semantic color of the block',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof InfoBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a service status with action.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[600px]">
      <InfoBlock {...args}>
        <InfoBlockContent>
          <Activity className="size-5 text-primary" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold tracking-tight">Main_Cluster_Status</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Uptime: 99.98%</span>
          </div>
        </InfoBlockContent>
        <InfoBlockActions>
          <Button variant="ghost" size="sm" className="gap-2">
            View_Logs <ChevronRight size={14} />
          </Button>
        </InfoBlockActions>
      </InfoBlock>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical context.
 */
export const CyberMonitor: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] p-8 border border-cyan-500/10 bg-black rounded-[3rem]">
      <InfoBlock {...args}>
        <InfoBlockContent>
          <Zap className="size-5 text-cyan-500" />
          <div className="flex flex-col gap-0.5 font-mono">
            <span className="text-xs font-black uppercase tracking-tighter text-white">// POWER_CELL_0x7F</span>
            <span className="text-[9px] text-cyan-500/60 uppercase">CHARGE: 82% // TEMP: 42°C</span>
          </div>
        </InfoBlockContent>
        <InfoBlockActions>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-500/40 uppercase">COLLECTING_</span>
          </div>
        </InfoBlockActions>
      </InfoBlock>
    </div>
  ),
};

/**
 * Semantic variant gallery for different system notification levels.
 */
export const SemanticLevels: Story = {
  render: () => (
    <div className="w-[600px] space-y-4">
      <InfoBlock variant="success">
        <InfoBlockContent>
          <CheckCircle className="size-5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold tracking-tight">Security_Protocol_Verified</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">ENCLAVE_LOCKED</span>
          </div>
        </InfoBlockContent>
        <InfoBlockActions>
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 dark:text-emerald-400">ACTIVE</Badge>
        </InfoBlockActions>
      </InfoBlock>

      <InfoBlock variant="warning">
        <InfoBlockContent>
          <Activity className="size-5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold tracking-tight">Latency_Deviation_Detected</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">PEAK: 142ms</span>
          </div>
        </InfoBlockContent>
        <InfoBlockActions>
          <Button size="icon" variant="ghost" className="size-8"><Refresh size={14}/></Button>
        </InfoBlockActions>
      </InfoBlock>
    </div>
  ),
};

/**
 * Demonstrates high-density layout using multiple blocks.
 */
export const ResourceGrid: Story = {
  render: () => (
    <div className="w-[800px] grid grid-cols-2 gap-4">
      <InfoBlock variant="primary">
        <InfoBlockContent>
          <Globe className="size-5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase">US_East</span>
            <span className="text-[9px] opacity-40 uppercase">Node_Count: 12</span>
          </div>
        </InfoBlockContent>
      </InfoBlock>
      <InfoBlock variant="secondary">
        <InfoBlockContent>
          <Globe className="size-5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase">EU_West</span>
            <span className="text-[9px] opacity-40 uppercase">Node_Count: 08</span>
          </div>
        </InfoBlockContent>
      </InfoBlock>
    </div>
  ),
};
