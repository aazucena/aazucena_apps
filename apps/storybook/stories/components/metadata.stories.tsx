import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  MetaData,
  MetaDataContent,
  MetaDataGrid,
  MetaDataHeader,
  MetaDataIcon,
  MetaDataItem,
  MetaDataLabel,
  MetaDataTitle,
  MetaDataValue,
} from '@aazucena/ui';
import { Calendar, Tag, User, Globe, Shield, Activity, Zap } from '@aazucena/icons';
import { Badge } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Layout suite for high-density technical metadata and specification readouts.
 * - **UX:** Features specialized `readout` and `stack` variants for different layout hierarchies.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with technical indicators (Mono-typography, Neon borders).
 * - **Composition:** Fully modular parts (Header, Grid, Item, Label, Value, Icon) for flexible data reporting.
 */
const meta = {
  title: 'Components/Data/MetaData',
  component: MetaData,
  subcomponents: {
    MetaDataHeader,
    MetaDataTitle,
    MetaDataContent,
    MetaDataGrid,
    MetaDataItem,
    MetaDataLabel,
    MetaDataValue,
    MetaDataIcon,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive layout system for displaying technical specifications, item metadata, or real-time status readouts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'card', 'glass', 'cyber', 'readout', 'stack'],
      description: 'The visual theme and layout of the metadata container',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof MetaData>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing article or project metadata in a card.
 */
export const BasicCard: Story = {
  args: {
    variant: 'card',
  },
  render: (args) => (
    <div className="w-[600px]">
      <MetaData {...args}>
        <MetaDataHeader>
          <MetaDataTitle size="lg">Entity_Specifications</MetaDataTitle>
        </MetaDataHeader>
        <MetaDataGrid cols={2}>
          <MetaDataItem>
            <MetaDataLabel>Auth_Unit</MetaDataLabel>
            <MetaDataValue className="flex items-center gap-2">
              <MetaDataIcon variant="muted"><User size={14} /></MetaDataIcon>
              Aldrin Azucena
            </MetaDataValue>
          </MetaDataItem>
          <MetaDataItem>
            <MetaDataLabel>Epoch_Timestamp</MetaDataLabel>
            <MetaDataValue className="flex items-center gap-2">
              <MetaDataIcon variant="muted"><Calendar size={14} /></MetaDataIcon>
              Feb 14, 2026
            </MetaDataValue>
          </MetaDataItem>
          <MetaDataItem>
            <MetaDataLabel>Visibility_Level</MetaDataLabel>
            <MetaDataValue>
              <Badge variant="outline" size="xs">PUBLIC_ACCESS</Badge>
            </MetaDataValue>
          </MetaDataItem>
          <MetaDataItem>
            <MetaDataLabel>Category_Node</MetaDataLabel>
            <MetaDataValue>Engineering_V4</MetaDataValue>
          </MetaDataItem>
        </MetaDataGrid>
      </MetaData>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTelemetry: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] p-8 bg-black rounded-2xl border border-cyan-500/10">
      <MetaData {...args} className="space-y-8">
        <MetaDataHeader>
          <div className="flex items-center gap-3 text-cyan-500 mb-2">
            <Activity className="size-4 animate-pulse" />
            <MetaDataTitle variant="cyber">// NODE_TELEMETRY</MetaDataTitle>
          </div>
        </MetaDataHeader>
        <MetaDataGrid cols={3} gap="lg">
          <MetaDataItem>
            <MetaDataLabel variant="cyber">UPLINK_ID</MetaDataLabel>
            <MetaDataValue variant="cyber" className="text-white">0x7F42</MetaDataValue>
          </MetaDataItem>
          <MetaDataItem>
            <MetaDataLabel variant="cyber">SIGNAL_GAIN</MetaDataLabel>
            <MetaDataValue variant="cyber" className="text-cyan-400">85.4%</MetaDataValue>
          </MetaDataItem>
          <MetaDataItem>
            <MetaDataLabel variant="cyber">SYNC_STATUS</MetaDataLabel>
            <MetaDataValue variant="cyber" className="text-emerald-500">STABLE</MetaDataValue>
          </MetaDataItem>
        </MetaDataGrid>
      </MetaData>
    </div>
  ),
};

/**
 * Compact horizontal readout, ideal for page headers or small status bars.
 */
export const HeaderReadout: Story = {
  render: () => (
    <div className="flex items-center bg-muted/30 border rounded-full px-6 py-2 gap-2">
      <div className="flex items-center gap-2 mr-4 opacity-40">
        <Shield size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">Live_Stats:</span>
      </div>
      <MetaData variant="readout">
        <MetaDataLabel variant="readout">LATENCY</MetaDataLabel>
        <MetaDataValue variant="readout">12MS</MetaDataValue>
      </MetaData>
      <MetaData variant="readout">
        <MetaDataLabel variant="readout">UPTIME</MetaDataLabel>
        <MetaDataValue variant="readout">99.9%</MetaDataValue>
      </MetaData>
      <MetaData variant="readout">
        <MetaDataLabel variant="readout">NODES</MetaDataLabel>
        <MetaDataValue variant="readout">142</MetaDataValue>
      </MetaData>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for sidebars over complex backgrounds.
 */
export const GlassSidebar: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <MetaData {...args} className="w-[300px] border-white/10 shadow-2xl">
        <MetaDataHeader>
          <MetaDataTitle size="lg" className="text-white">File_Info</MetaDataTitle>
        </MetaDataHeader>
        <div className="space-y-6">
          <MetaDataItem>
            <MetaDataLabel className="text-white/40">Resource_Type</MetaDataLabel>
            <MetaDataValue className="text-white font-bold">Encrypted_Payload</MetaDataValue>
          </MetaDataItem>
          <MetaDataItem>
            <MetaDataLabel className="text-white/40">Size_Weight</MetaDataLabel>
            <MetaDataValue className="text-white font-mono">1.42 GB</MetaDataValue>
          </MetaDataItem>
          <MetaDataItem>
            <MetaDataLabel className="text-white/40">Encryption</MetaDataLabel>
            <MetaDataValue className="text-white flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" /> AES-256-GCM
            </MetaDataValue>
          </MetaDataItem>
        </div>
      </MetaData>
    </div>
  ),
};
