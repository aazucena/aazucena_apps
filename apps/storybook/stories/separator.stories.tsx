import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for visual and semantic separation of content.
 * - **Accessibility:** Uses standard `role="separator"` and `aria-orientation` attributes; supports `decorative` prop for hiding from screen readers.
 * - **Design:** Optimized for high-fidelity technical depth with support for `glass`, `cyber`, and `gradient` presets.
 * - **Performance:** Lightweight CSS-driven component with standard thickness presets.
 */
const meta = {
  title: 'Components/Primitives/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A simple line component used to separate content visually and semantically.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The physical axis of the line',
      table: { category: 'Layout' }
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'gradient', 'cyber-gradient'],
      description: 'The visual theme and color palette',
      table: { category: 'Appearance' }
    },
    thickness: {
      control: 'radio',
      options: ['thin', 'default', 'thick'],
      description: 'The visual weight of the line',
      table: { category: 'Appearance' }
    },
    decorative: {
      control: 'boolean',
      description: 'If true, hide from screen readers',
      table: { category: 'Behavior' }
    }
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for separating blocks of text or items.
 */
export const Basic: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[400px] space-y-4">
      <p className="text-sm font-bold">Protocol_Header</p>
      <Separator {...args} />
      <p className="text-xs opacity-60">Initializing ingestion sequence for primary node cluster US_EAST_01.</p>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon glow and technical tint.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    thickness: 'default',
  },
  render: (args) => (
    <div className="w-[500px] p-8 bg-black border border-cyan-500/10 rounded-xl space-y-6">
      <div className="flex justify-between items-center text-cyan-500 font-mono text-[10px]">
        <span>// SESSION_ID: 0x7F42</span>
        <span>STATUS: ACTIVE</span>
      </div>
      <Separator {...args} />
      <div className="flex justify-between items-center text-cyan-500/40 font-mono text-[9px]">
        <span>UPLINK_READY</span>
        <span>LATENCY: 12ms</span>
      </div>
    </div>
  ),
};

/**
 * Modern gradient variant for high-impact section dividers.
 */
export const Highlight: Story = {
  args: {
    variant: 'gradient',
    thickness: 'thick',
  },
  render: (args) => (
    <div className="w-[600px] space-y-8">
      <h2 className="text-4xl font-black tracking-tighter uppercase">Project_Intelligence</h2>
      <Separator {...args} />
      <div className="h-20 bg-muted/20 rounded-xl border border-dashed flex items-center justify-center italic text-xs opacity-20 uppercase tracking-widest">
        Main_Content_Stage
      </div>
    </div>
  ),
};

/**
 * Demonstrates the vertical orientation within a flex container.
 */
export const VerticalSplit: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div className="flex h-12 items-center space-x-6 px-6 py-2 border rounded-full bg-card">
      <div className="font-black uppercase tracking-widest text-xs">Blog</div>
      <Separator {...args} />
      <div className="font-black uppercase tracking-widest text-xs">Docs</div>
      <Separator {...args} />
      <div className="font-black uppercase tracking-widest text-xs">Intel</div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 to-blue-800 rounded-[3rem] w-[600px] flex flex-col items-center gap-6">
      <span className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">Atmospheric_Control</span>
      <Separator {...args} className="w-1/2" />
      <div className="p-8 glass border-white/10 rounded-2xl text-white font-bold uppercase text-xs">
        Layer_Sync_Active
      </div>
    </div>
  ),
};
