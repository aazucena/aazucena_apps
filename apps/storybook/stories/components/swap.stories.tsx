import type { Meta, StoryObj } from '@storybook/react-vite';
import { Swap } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Binary toggle primitive that transitions between two visual states with animation support.
 * - **UX:** Supports both controlled and uncontrolled modes with rotate, flip, and fade transition effects.
 * - **Accessibility:** Operates as a `role="button"` with keyboard support (Enter/Space) and clear visual state differentiation.
 */
const meta = {
  title: 'Components/Utilities/Swap',
  component: Swap,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toggle component that swaps between two content states with optional animation effects (rotate, flip, fade). Supports controlled and uncontrolled modes with size variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the swap container',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    active: {
      control: 'boolean',
      description: 'Controlled active state (shows `on` content when true)',
      table: { category: 'State', type: { summary: 'boolean' } },
    },
    rotate: {
      control: 'boolean',
      description: 'Enable 180-degree rotation animation on swap',
      table: {
        category: 'Animation',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    flip: {
      control: 'boolean',
      description: 'Enable horizontal flip animation on swap',
      table: {
        category: 'Animation',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onSwap: {
      description: 'Callback fired with the new active state on toggle',
      table: { category: 'Events', type: { summary: '(active: boolean) => void' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Swap>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard swap toggle between sun and moon icons. Click to toggle.
 */
export const Basic: Story = {
  args: {
    on: <span className="text-lg">🌙</span>,
    off: <span className="text-lg">☀️</span>,
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a vivid gradient background for frosted-glass UI contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon styling applied to the swap container.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    rotate: true,
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

// --- SIZE VARIANTS ---

/**
 * Comparison of all three size presets rendered side by side.
 */
export const Sizes: Story = {
  args: {
    on: <span>🌙</span>,
    off: <span>☀️</span>,
  },
  render: () => (
    <div className="flex items-center gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Swap on={<span>🌙</span>} off={<span>☀️</span>} size={size} />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{size}</span>
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Swap with a smooth 180-degree rotation transition between states.
 */
export const Rotate: Story = {
  args: {
    ...Basic.args,
    rotate: true,
    size: 'lg',
  },
};

/**
 * Swap with a horizontal flip animation for a card-turn effect.
 */
export const Flip: Story = {
  args: {
    ...Basic.args,
    flip: true,
    size: 'lg',
  },
};
