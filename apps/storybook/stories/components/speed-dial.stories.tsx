import type { Meta, StoryObj } from '@storybook/react-vite';
import { SpeedDial } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Floating action button with expandable action menu and stagger animation.
 * - **UX:** Hover/click to reveal secondary actions with per-item staggered transition delays.
 * - **Design:** Fixed positioning with configurable direction (up, left) and 3 position presets.
 */
const meta = {
  title: 'Components/Actions/SpeedDial',
  component: SpeedDial,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Floating action button that expands to reveal a radial menu of secondary actions. Supports up/left direction, 3 position presets, and 3 visual variants with staggered animation.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant for trigger and action buttons',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: "'default'" },
      },
    },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left', 'bottom-center'],
      description: 'Fixed positioning on the viewport',
      table: {
        category: 'Layout',
        type: { summary: "'bottom-right' | 'bottom-left' | 'bottom-center'" },
        defaultValue: { summary: "'bottom-right'" },
      },
    },
    direction: {
      control: 'select',
      options: ['up', 'left'],
      description: 'Direction actions expand toward from the trigger',
      table: {
        category: 'Layout',
        type: { summary: "'up' | 'left'" },
        defaultValue: { summary: "'up'" },
      },
    },
  },
} satisfies Meta<typeof SpeedDial>;

export default meta;
type Story = StoryObj<typeof meta>;

const shareIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="m8.59 13.51 6.83 3.98" /><path d="m15.41 6.51-6.82 3.98" />
  </svg>
);

const editIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const trashIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const defaultActions = [
  { label: 'Share', icon: shareIcon },
  { label: 'Edit', icon: editIcon },
  { label: 'Delete', icon: trashIcon },
];

// --- BASIC USAGE ---

/**
 * Standard speed dial in the bottom-right corner. Hover or click the FAB to expand.
 */
export const Basic: Story = {
  args: {
    actions: defaultActions,
    direction: 'up',
    variant: 'default',
    position: 'bottom-right',
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background p-8">
        <p className="text-sm text-muted-foreground">Hover the FAB in the bottom-right corner</p>
        <Story />
      </div>
    ),
  ],
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for immersive overlay contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <p className="text-sm text-white/80">Glass speed dial on gradient background</p>
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon glow trigger and dark action buttons.
 */
export const Cyber: Story = {
  args: {
    actions: [
      { label: 'SCAN', icon: shareIcon },
      { label: 'DEPLOY', icon: editIcon },
      { label: 'TERMINATE', icon: trashIcon },
    ],
    variant: 'cyber',
    direction: 'up',
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-black p-8">
        <p className="font-mono text-sm text-cyan-500/60">SPEED_DIAL :: HOVER_TO_EXPAND</p>
        <Story />
      </div>
    ),
  ],
};

// --- ADVANCED ---

/**
 * Left direction expansion, suitable for bottom-right positioned FABs with wide content.
 */
export const LeftDirection: Story = {
  args: {
    ...Basic.args,
    direction: 'left',
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background p-8">
        <p className="text-sm text-muted-foreground">Actions expand to the left</p>
        <Story />
      </div>
    ),
  ],
};

/**
 * Bottom-left positioning for layouts with right-aligned primary content.
 */
export const BottomLeft: Story = {
  args: {
    ...Basic.args,
    position: 'bottom-left',
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background p-8">
        <p className="text-sm text-muted-foreground">FAB positioned in bottom-left corner</p>
        <Story />
      </div>
    ),
  ],
};

/**
 * Bottom-center positioning for app-bar style layouts.
 */
export const BottomCenter: Story = {
  args: {
    ...Basic.args,
    position: 'bottom-center',
  },
  decorators: [
    (Story) => (
      <div className="relative h-[400px] bg-background p-8">
        <p className="text-center text-sm text-muted-foreground">FAB centered at bottom</p>
        <Story />
      </div>
    ),
  ],
};
