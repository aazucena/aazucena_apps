import type { Meta, StoryObj } from '@storybook/react';
import { Backdrop } from '@aazucena/ui';
import { useState } from 'react';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber / light) with opacity transition |
 * | UX | Full-screen overlay that dismisses on click; conditionally rendered via `open` prop |
 * | Design | Fixed-position inset-0 layer with z-40; glass/cyber add backdrop-blur for depth |
 */
const meta = {
  title: 'Components/Primitives/Backdrop',
  component: Backdrop,
  parameters: {
    docs: {
      description: {
        component:
          'A full-screen overlay component used behind modals, drawers, and sheets. Supports four visual variants including glass blur and cyber blur effects. Renders conditionally based on the `open` prop and fires `onDismiss` on click.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'light'],
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'light'" },
        defaultValue: { summary: 'default' },
      },
    },
    open: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    onDismiss: {
      action: 'dismissed',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    className: {
      control: 'text',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border">
        <div className="flex h-full items-center justify-center bg-background p-4">
          <p className="text-sm text-muted-foreground">Content behind the backdrop</p>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Backdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Default semi-transparent black backdrop overlaying content.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    open: true,
  },
  render: (args) => <Backdrop {...args} className="!absolute !z-10" />,
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with backdrop-blur providing a frosted-glass effect over a gradient.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <div className="relative h-48 overflow-hidden rounded-xl">
        <div className="flex h-full items-center justify-center">
          <p className="text-sm font-medium text-white">Background content</p>
        </div>
        <Backdrop {...args} className="!absolute !z-10" />
      </div>
    </div>
  ),
};

/**
 * Cyber variant with heavier blur and darker overlay for terminal-style UIs.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
  },
  render: (args) => <Backdrop {...args} className="!absolute !z-10" />,
};

/**
 * Light variant using a white overlay with subtle blur, suitable for light-mode UIs.
 */
export const Light: Story = {
  args: {
    ...Basic.args,
    variant: 'light',
  },
  render: (args) => <Backdrop {...args} className="!absolute !z-10" />,
};

// --- ADVANCED ---

/**
 * All four variants displayed in a grid for quick visual comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(['default', 'glass', 'cyber', 'light'] as const).map((v) => (
        <div key={v} className="relative h-32 overflow-hidden rounded-xl border border-border">
          <div className="flex h-full items-center justify-center bg-background">
            <p className="text-xs text-muted-foreground">{v}</p>
          </div>
          <Backdrop variant={v} open className="!absolute !z-10" />
          <span className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded bg-background/80 px-2 py-0.5 text-[10px] font-medium">
            {v}
          </span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Interactive toggle demonstrating open/dismiss behavior with state management.
 */
export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative h-48 overflow-hidden rounded-xl border border-border">
        <div className="flex h-full items-center justify-center bg-background">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Show Backdrop
          </button>
        </div>
        <Backdrop open={open} onDismiss={() => setOpen(false)} className="!absolute !z-10" />
        {open && (
          <p className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-white">
            Click to dismiss
          </p>
        )}
      </div>
    );
  },
};
