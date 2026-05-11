import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paper } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Elevated surface container with configurable shadow depth, padding, and shape.
 * - **UX:** Provides visual hierarchy through Material-inspired elevation levels (0-5).
 * - **Design:** Foundation primitive for cards, panels, dialogs, and content sections. Supports outlined variant for flat layouts.
 */
const meta = {
  title: 'Components/Layout/Paper',
  component: Paper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Elevated surface container with configurable shadow depth, padding, and border radius. Foundation for card-like layouts with 4 visual variants and 6 elevation levels.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'outlined'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'outlined'" },
        defaultValue: { summary: "'default'" },
      },
    },
    elevation: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5],
      description: 'Shadow elevation level (0 = none, 5 = maximum)',
      table: {
        category: 'Appearance',
        type: { summary: '0 | 1 | 2 | 3 | 4 | 5' },
        defaultValue: { summary: '1' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Internal padding preset',
      table: {
        category: 'Appearance',
        type: { summary: "'none' | 'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: "'md'" },
      },
    },
    square: {
      control: 'boolean',
      description: 'Removes border radius when true',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Paper>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard paper surface with default elevation and padding.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    elevation: 2,
    padding: 'lg',
    children: (
      <div>
        <h3 className="font-semibold">Paper Surface</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Content rendered on an elevated surface container.
        </p>
      </div>
    ),
  },
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant with backdrop blur for immersive UI contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Paper {...args}>
        <div>
          <h3 className="font-semibold">Glass Surface</h3>
          <p className="mt-2 text-sm opacity-80">Frosted glass effect with backdrop blur.</p>
        </div>
      </Paper>
    </div>
  ),
};

/**
 * High-fidelity cyber variant for terminal-style and tech dashboards.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    children: (
      <div className="font-mono">
        <h3 className="text-cyan-400">DATA_PANEL</h3>
        <p className="mt-2 text-xs text-cyan-500/60">Secure container // encrypted</p>
      </div>
    ),
  },
};

/**
 * Outlined variant with border and transparent background.
 */
export const Outlined: Story = {
  args: {
    ...Basic.args,
    variant: 'outlined',
    elevation: 0,
    children: (
      <div>
        <h3 className="font-semibold">Outlined Surface</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Flat surface with border, no shadow elevation.
        </p>
      </div>
    ),
  },
};

// --- ELEVATION VARIANTS ---

/**
 * Side-by-side comparison of all 6 elevation levels (0-5).
 */
export const Elevations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {([0, 1, 2, 3, 4, 5] as const).map((e) => (
        <Paper key={e} elevation={e} padding="md">
          <p className="text-center font-mono text-xs text-muted-foreground">elevation={e}</p>
        </Paper>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Comparison of all padding presets from none to xl.
 */
export const PaddingPresets: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((p) => (
        <Paper key={p} elevation={1} padding={p}>
          <span className="font-mono text-xs text-muted-foreground">padding=&quot;{p}&quot;</span>
        </Paper>
      ))}
    </div>
  ),
};

/**
 * Square paper with no border radius, useful for edge-to-edge layouts.
 */
export const Square: Story = {
  args: {
    ...Basic.args,
    square: true,
    children: (
      <div>
        <h3 className="font-semibold">Square Paper</h3>
        <p className="mt-2 text-sm text-muted-foreground">No border radius for flush layouts.</p>
      </div>
    ),
  },
};
