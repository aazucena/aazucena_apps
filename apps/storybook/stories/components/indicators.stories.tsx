import type { Meta, StoryObj } from '@storybook/react-vite';
import { Indicator } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Badge-style indicator overlay for notification counts and status dots.
 * - **UX:** Wraps any child element and positions an absolute indicator in a chosen corner.
 * - **Design:** Six semantic variants with four size presets including a minimal dot mode.
 * - **Accessibility:** Animated ping effect for attention-drawing without motion-sickness triggers.
 */
const meta = {
  title: 'Components/Feedback/Indicator',
  component: Indicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Positioned indicator overlay for notification counts and status dots. Wraps child elements with an absolute-positioned badge supporting dot, small, medium, and large sizes.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'destructive', 'success', 'warning'],
      description: 'Visual style and color scheme',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'destructive' | 'success' | 'warning'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['dot', 'sm', 'md', 'lg'],
      description: 'Indicator size — dot shows no content, others display count',
      table: {
        category: 'Appearance',
        type: { summary: "'dot' | 'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'sm' },
      },
    },
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description: 'Corner placement of the indicator',
      table: {
        category: 'Appearance',
        type: { summary: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'" },
        defaultValue: { summary: 'top-right' },
      },
    },
    ping: {
      control: 'boolean',
      description: 'Enables a pulsing animation ring',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    count: {
      control: { type: 'number', min: 0, max: 200 },
      description: 'Numeric count to display inside the indicator',
      table: {
        category: 'Content',
        type: { summary: 'number' },
      },
    },
    maxCount: {
      control: { type: 'number', min: 1, max: 999 },
      description: 'Maximum count before showing overflow (e.g. 99+)',
      table: {
        category: 'Content',
        type: { summary: 'number' },
        defaultValue: { summary: '99' },
      },
    },
    showZero: {
      control: 'boolean',
      description: 'Show count even when value is zero',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
      <div className="flex items-center justify-center p-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Indicator>;

export default meta;
type Story = StoryObj<typeof meta>;

const IconBox = () => (
  <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  </div>
);

// --- BASIC USAGE ---

/**
 * Standard indicator with a numeric count on a notification bell icon.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'sm',
    count: 5,
    children: <IconBox />,
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glassmorphic indicator on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    count: 3,
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Indicator {...args}>
        <IconBox />
      </Indicator>
    </div>
  ),
};

/**
 * Neon-glow cyber indicator for dark terminal interfaces.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    count: 12,
  },
};

// --- SIZE VARIANTS ---

/**
 * Comparison of all four size tiers from minimal dot to large badge.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {(['dot', 'sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} className="text-center">
          <Indicator size={s} count={7}>
            <IconBox />
          </Indicator>
          <p className="mt-3 text-xs font-mono text-muted-foreground">{s}</p>
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Semantic color variants for different notification types.
 */
export const SemanticColors: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {(['default', 'destructive', 'success', 'warning'] as const).map((v) => (
        <div key={v} className="text-center">
          <Indicator variant={v} count={3} ping={v === 'destructive'}>
            <IconBox />
          </Indicator>
          <p className="mt-3 text-xs font-mono text-muted-foreground">{v}</p>
        </div>
      ))}
    </div>
  ),
};

/**
 * Animated ping effect drawing attention to urgent notifications.
 */
export const PingAnimation: Story = {
  args: {
    ...Basic.args,
    variant: 'destructive',
    count: 99,
    ping: true,
    size: 'md',
  },
};

/**
 * Overflow display when count exceeds maxCount threshold.
 */
export const Overflow: Story = {
  args: {
    ...Basic.args,
    count: 150,
    maxCount: 99,
    size: 'lg',
  },
};
