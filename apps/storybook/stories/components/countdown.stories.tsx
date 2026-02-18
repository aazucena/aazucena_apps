import type { Meta, StoryObj } from '@storybook/react-vite';
import { Countdown } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Temporal display primitive rendering a live countdown to a target timestamp.
 * - **UX:** Auto-updating segments (days, hours, minutes, seconds) with individual visibility toggles and optional label.
 * - **Design:** Three variants (default, glass, cyber) and three sizes (sm, md, lg) with styled segment boxes.
 * - **Performance:** Single `setInterval` with cleanup; segment visibility reduces DOM nodes when disabled.
 */
const meta = {
  title: 'Components/Data Display/Countdown',
  component: Countdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A live countdown timer that displays remaining time to a target date or timestamp. Features configurable segments (days, hours, minutes, seconds), optional label, and an onComplete callback. Supports default, glass, and cyber variants with three size presets.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant for segment boxes',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size preset controlling segment box dimensions and font size',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    target: {
      control: 'date',
      description: 'Target date or timestamp (Date object or epoch milliseconds)',
      table: {
        category: 'Content',
        type: { summary: 'Date | number' },
      },
    },
    label: {
      control: 'text',
      description: 'Optional label displayed above the countdown segments',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    showDays: {
      control: 'boolean',
      description: 'Show the days segment',
      table: {
        category: 'Display',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showHours: {
      control: 'boolean',
      description: 'Show the hours segment',
      table: {
        category: 'Display',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showMinutes: {
      control: 'boolean',
      description: 'Show the minutes segment',
      table: {
        category: 'Display',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showSeconds: {
      control: 'boolean',
      description: 'Show the seconds segment',
      table: {
        category: 'Display',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    onComplete: {
      action: 'completed',
      description: 'Callback fired when the countdown reaches zero',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: { category: 'Styling' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px] flex justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// 24 hours from now
const FUTURE_24H = Date.now() + 86_400_000;

// --- BASIC USAGE ---

/**
 * Standard countdown with all segments visible, targeting 24 hours from now.
 */
export const Basic: Story = {
  args: {
    target: FUTURE_24H,
    variant: 'default',
    size: 'md',
    label: 'Event starts in',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glassmorphic variant with frosted segment boxes on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    label: 'Launching soon',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Countdown {...args} />
    </div>
  ),
};

/**
 * Cyber variant with neon segment borders and monospaced numerals for terminal aesthetics.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    label: 'SYSTEM_REBOOT_IN',
  },
};

// --- SIZE VARIANTS ---

/**
 * All three size presets displayed vertically for direct comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <Countdown target={FUTURE_24H} size="sm" label="Small" />
      <Countdown target={FUTURE_24H} size="md" label="Medium" />
      <Countdown target={FUTURE_24H} size="lg" label="Large" />
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Countdown showing only hours, minutes, and seconds with the days segment hidden.
 * Useful for short-duration timers like flash sales or session timeouts.
 */
export const HoursOnly: Story = {
  args: {
    ...Basic.args,
    showDays: false,
    label: 'Time remaining',
  },
};

/**
 * Minutes and seconds only, simulating a session or quiz timer.
 */
export const ShortTimer: Story = {
  args: {
    target: Date.now() + 300_000,
    variant: 'default',
    size: 'lg',
    showDays: false,
    showHours: false,
    label: 'Session expires',
  },
};
