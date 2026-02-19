import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReadingTime, ReadingTimeIcon, ReadingTimeValue } from '@aazucena/ui';
import { Activity, Zap } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic metadata primitive for estimating content consumption duration.
 * - **UX:** Features flexible sub-components for icons and text values to support custom formatting.
 * - **Aesthetics:** Aligned with site-wide themes (`muted`, `cyber`, `bright`) with support for high-contrast technical labels.
 * - **Composition:** Modular parts (Icon, Value) for flexible layout within headers or cards.
 */
const meta = {
  title: 'Components/Data/ReadingTime',
  component: ReadingTime,
  subcomponents: { ReadingTimeIcon, ReadingTimeValue } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A small metadata component used to display the estimated reading or consumption time for an article or module.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber', 'bright', 'muted'],
      description: 'The visual theme of the component',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg'],
      description: 'The typography and icon scale',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof ReadingTime>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a basic read time for an article.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'default',
  },
  render: (args) => (
    <ReadingTime {...args}>
      <ReadingTimeIcon />
      <ReadingTimeValue>12 min read</ReadingTimeValue>
    </ReadingTime>
  ),
};

/**
 * High-performance cyber variant with mono typography and technical tint.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    size: 'sm',
  },
  render: (args) => (
    <div className="p-8 bg-black border border-cyan-500/10 rounded-xl">
      <ReadingTime {...args}>
        <ReadingTimeIcon icon={<Zap className="size-3.5 text-cyan-500" />} />
        <ReadingTimeValue>EST_PROCESSING: 120s</ReadingTimeValue>
      </ReadingTime>
    </div>
  ),
};

/**
 * High-contrast muted variant, ideal for high-density metadata lists.
 */
export const TechMetadata: Story = {
  args: {
    variant: 'muted',
    size: 'xs',
  },
  render: (args) => (
    <ReadingTime {...args}>
      <ReadingTimeIcon icon={<Activity className="size-3" />} />
      <ReadingTimeValue>PULSE_EST: 42MS</ReadingTimeValue>
    </ReadingTime>
  ),
};

/**
 * Demonstrates the range of available size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ReadingTime size="xs" variant="bright">
        <ReadingTimeIcon /> <ReadingTimeValue>Extra_Small_Read (9px)</ReadingTimeValue>
      </ReadingTime>
      <ReadingTime size="sm" variant="bright">
        <ReadingTimeIcon /> <ReadingTimeValue>Small_Read (10px)</ReadingTimeValue>
      </ReadingTime>
      <ReadingTime size="default" variant="bright">
        <ReadingTimeIcon /> <ReadingTimeValue>Default_Read (12px)</ReadingTimeValue>
      </ReadingTime>
      <ReadingTime size="lg" variant="bright">
        <ReadingTimeIcon /> <ReadingTimeValue>Large_Read (14px)</ReadingTimeValue>
      </ReadingTime>
    </div>
  ),
};
