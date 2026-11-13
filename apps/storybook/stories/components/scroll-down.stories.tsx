import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollDown, ScrollDownIcon, ScrollDownLabel } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Navigation indicator primitive for driving initial user scroll behavior.
 * - **UX:** Features a delayed entrance (`timeout`) to avoid visual clutter during initial mount.
 * - **Accessibility:** Built with standard Button semantics and `aria-label="Scroll down"`.
 * - **Animation:** Includes an infinite vertical bounce icon (`ScrollDownIcon`) to signify directional intent.
 * - **Variants:** Supports `glass` and high-fidelity `cyber` themes.
 */
const meta = {
  title: 'Components/Primitives/ScrollDown',
  component: ScrollDown,
  subcomponents: { ScrollDownIcon, ScrollDownLabel } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A visual cue typically placed at the bottom of hero sections to encourage users to scroll for more content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the indicator',
      table: { category: 'Appearance' },
    },
    visible: {
      control: 'boolean',
      description: 'The base visibility state (subject to timeout)',
      table: { category: 'State' },
    },
    timeout: {
      control: 'number',
      description: 'Delay in ms before the indicator appears',
      table: { category: 'Behavior', defaultValue: { summary: '2000' } },
    },
  },
} satisfies Meta<typeof ScrollDown>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing the bouncing icon and uppercase label.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    visible: true,
    timeout: 500, // Faster for Storybook demo
  },
  render: (args) => (
    <div className="h-[300px] w-full flex items-center justify-center relative bg-muted/5 border border-dashed rounded-card">
      <ScrollDown {...args} className="absolute bottom-8">
        <ScrollDownIcon />
        <ScrollDownLabel>Scroll_Down</ScrollDownLabel>
      </ScrollDown>
      <p className="text-xs opacity-20 uppercase tracking-widest">Indicator_Stage</p>
    </div>
  ),
};

/**
 * Cyber variant: signal rule and Fira Code labels.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    visible: true,
    timeout: 500,
  },
  render: (args) => (
    <div className="h-[300px] w-full bg-background border border-signal/10 rounded-card relative overflow-hidden flex items-center justify-center">
      <ScrollDown {...args} className="absolute bottom-8">
        <ScrollDownIcon className="text-signal" />
        <ScrollDownLabel className="text-signal font-mono italic">// DISCOVER_MORE</ScrollDownLabel>
      </ScrollDown>
      <h1 className="font-mono text-signal/10 text-4xl font-black italic select-none uppercase tracking-[0.2em]">
        UPLINK_CORE
      </h1>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over cinematic backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
    visible: true,
    timeout: 500,
  },
  render: (args) => (
    <div className="p-40 rounded-card relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-scrim" />
      <ScrollDown {...args} className="absolute bottom-8">
        <ScrollDownIcon className="text-foreground" />
        <ScrollDownLabel className="text-foreground/60">Atmospheric_Descent</ScrollDownLabel>
      </ScrollDown>
      <div className="p-12 glass border-rule rounded-full">
        <span className="text-foreground font-black text-xl tracking-tighter uppercase">
          Crystal_Layer
        </span>
      </div>
    </div>
  ),
};
