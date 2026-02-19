import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Brief,
  BriefCallout,
  BriefHeader,
  BriefItem,
  BriefLabel,
  BriefSection,
  BriefValue,
} from '@aazucena/ui';
import { Activity, Globe, Shield, Database } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite informational card for structured metadata (Sidebar details, Project specs).
 * - **UX:** Uses high-contrast typography hierarchy (Label vs Value) for rapid scanning.
 * - **Aesthetics:** Supports `glass` and `cyber` presets to match site-wide atmospheric layers.
 * - **Composition:** Fully atomic parts (Header, Section, Item, Callout) for flexible layout.
 */
const meta = {
  title: 'Components/Data/Brief',
  component: Brief,
  subcomponents: {
    BriefHeader,
    BriefSection,
    BriefItem,
    BriefLabel,
    BriefValue,
    BriefCallout,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A structured informational module used to display technical specifications, project metadata, or status summaries.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual style of the brief container',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Brief>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for project or profile metadata.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[450px]">
      <Brief {...args}>
        <BriefHeader>SPECIFICATION_META</BriefHeader>
        <BriefSection>
          <BriefItem>
            <BriefLabel>Status</BriefLabel>
            <BriefValue>Production Ready</BriefValue>
          </BriefItem>
          <BriefItem>
            <BriefLabel>Version</BriefLabel>
            <BriefValue>v2.4.0-stable</BriefValue>
          </BriefItem>
        </BriefSection>
        <BriefCallout>
          <Activity className="size-5 shrink-0" />
          <p className="text-xs">
            Real-time ingestion is active and reporting optimal latency across all nodes.
          </p>
        </BriefCallout>
      </Brief>
    </div>
  ),
};

/**
 * High-performance cyber variant with mono typography and cyan tints.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[450px]">
      <Brief {...args}>
        <BriefHeader className="text-cyan-600 dark:text-cyan-400">
          // CORE_SPECIFICATIONS
        </BriefHeader>
        <BriefSection>
          <div className="grid grid-cols-2 gap-8">
            <BriefItem>
              <BriefLabel>IDENT_NODE</BriefLabel>
              <BriefValue className="font-mono">0x7F42</BriefValue>
            </BriefItem>
            <BriefItem>
              <BriefLabel>SIGNAL_GAIN</BriefLabel>
              <BriefValue className="font-mono text-cyan-500">85.4%</BriefValue>
            </BriefItem>
          </div>
        </BriefSection>
        <BriefCallout variant="cyber">
          <Globe className="size-5 shrink-0" />
          <p className="text-xs font-mono">
            ENCRYPTED_UPLINK_ESTABLISHED // TARGET: ORBITAL_STATION_01
          </p>
        </BriefCallout>
      </Brief>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for sidebars over complex backgrounds.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-zinc-900 to-zinc-800 rounded-[3rem]">
      <div className="w-[400px]">
        <Brief {...args}>
          <BriefHeader className="text-white/60">NODE_OVERVIEW</BriefHeader>
          <BriefSection>
            <BriefItem>
              <BriefLabel className="text-white/40">Encryption</BriefLabel>
              <BriefValue className="text-white flex items-center gap-2">
                <Shield size={14} className="text-emerald-400" /> AES-256-GCM
              </BriefValue>
            </BriefItem>
            <BriefItem>
              <BriefLabel className="text-white/40">Database</BriefLabel>
              <BriefValue className="text-white flex items-center gap-2">
                <Database size={14} className="text-blue-400" /> ClickHouse_Cluster
              </BriefValue>
            </BriefItem>
          </BriefSection>
          <BriefCallout variant="glass">
            <p className="text-xs text-white/80">Atmospheric layer: **MESOSPHERE**</p>
          </BriefCallout>
        </Brief>
      </div>
    </div>
  ),
};

/**
 * Demonstrates a complex grid-based layout for high-density information.
 */
export const DenseLayout: Story = {
  render: () => (
    <div className="w-[500px]">
      <Brief variant="default">
        <BriefHeader>DENSE_TELEMETRY</BriefHeader>
        <BriefSection className="grid grid-cols-3 gap-6 space-y-0">
          <BriefItem>
            <BriefLabel>CPU</BriefLabel>
            <BriefValue>12%</BriefValue>
          </BriefItem>
          <BriefItem>
            <BriefLabel>RAM</BriefLabel>
            <BriefValue>4.2GB</BriefValue>
          </BriefItem>
          <BriefItem>
            <BriefLabel>SSD</BriefLabel>
            <BriefValue>85%</BriefValue>
          </BriefItem>
          <BriefItem>
            <BriefLabel>TEMP</BriefLabel>
            <BriefValue>42°C</BriefValue>
          </BriefItem>
          <BriefItem>
            <BriefLabel>UP</BriefLabel>
            <BriefValue>12d</BriefValue>
          </BriefItem>
          <BriefItem>
            <BriefLabel>ERR</BriefLabel>
            <BriefValue className="text-rose-500">0</BriefValue>
          </BriefItem>
        </BriefSection>
      </Brief>
    </div>
  ),
};
