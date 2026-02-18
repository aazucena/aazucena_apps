import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionBar } from '@aazucena/ui';
import { fn } from '@storybook/test';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Fixed-position floating toolbar for contextual bulk actions or selection controls.
 * - **UX:** Appears/disappears with smooth transitions, anchored to top or bottom of the viewport.
 * - **Composition:** Accepts any children (typically buttons or controls) with an optional built-in close button via `onClose`.
 */
const meta = {
  title: 'Components/Navigation/ActionBar',
  component: ActionBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A floating action bar fixed to the viewport edge. Ideal for contextual bulk actions, selection toolbars, or persistent controls. Supports top/bottom positioning and variant styling.',
      },
      story: {
        inline: false,
        height: '200px',
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
    position: {
      control: 'radio',
      options: ['top', 'bottom'],
      description: 'Viewport anchor position',
      table: {
        category: 'Layout',
        type: { summary: "'top' | 'bottom'" },
        defaultValue: { summary: "'bottom'" },
      },
    },
    open: {
      control: 'boolean',
      description: 'Whether the action bar is visible',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClose: {
      description: 'Callback when the close button is pressed. Renders close button when provided.',
      table: { category: 'Events', type: { summary: '() => void' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const ActionButtons = () => (
  <>
    <button className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium">Cut</button>
    <button className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium">Copy</button>
    <button className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium">Paste</button>
  </>
);

// --- BASIC USAGE ---

/**
 * Standard bottom-anchored action bar with three contextual actions and a close button.
 */
export const Basic: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: (args) => (
    <div className="relative h-[180px] w-full overflow-hidden rounded-xl border border-dashed">
      <ActionBar {...args}>
        <ActionButtons />
      </ActionBar>
      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest opacity-20">
        Content Area
      </div>
    </div>
  ),
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a vivid gradient background for frosted-glass UI contexts.
 */
export const Glass: Story = {
  args: {
    open: true,
    variant: 'glass',
    onClose: fn(),
  },
  render: (args) => (
    <div className="relative h-[180px] w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
      <ActionBar {...args}>
        <button className="rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          Cut
        </button>
        <button className="rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          Copy
        </button>
        <button className="rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          Paste
        </button>
      </ActionBar>
      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-white/30">
        Glass Context
      </div>
    </div>
  ),
};

/**
 * Cyber variant with neon-styled action buttons on a dark terminal background.
 */
export const Cyber: Story = {
  args: {
    open: true,
    variant: 'cyber',
    onClose: fn(),
  },
  render: (args) => (
    <div className="relative h-[180px] w-full overflow-hidden rounded-xl border border-cyan-500/10 bg-black">
      <ActionBar {...args}>
        <button className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs text-cyan-300">
          CUT
        </button>
        <button className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs text-cyan-300">
          COPY
        </button>
        <button className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs text-cyan-300">
          PASTE
        </button>
      </ActionBar>
      <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-cyan-500/20">
        TERMINAL_STAGE
      </div>
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Action bar anchored to the top of the viewport instead of the bottom.
 */
export const TopPosition: Story = {
  args: {
    open: true,
    position: 'top',
    onClose: fn(),
  },
  render: (args) => (
    <div className="relative h-[180px] w-full overflow-hidden rounded-xl border border-dashed">
      <ActionBar {...args}>
        <ActionButtons />
      </ActionBar>
      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest opacity-20">
        Content Area
      </div>
    </div>
  ),
};

/**
 * Action bar without a close button, used for persistent non-dismissible toolbars.
 */
export const NoDismiss: Story = {
  args: {
    open: true,
  },
  render: (args) => (
    <div className="relative h-[180px] w-full overflow-hidden rounded-xl border border-dashed">
      <ActionBar {...args}>
        <ActionButtons />
      </ActionBar>
      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest opacity-20">
        Persistent Toolbar
      </div>
    </div>
  ),
};
