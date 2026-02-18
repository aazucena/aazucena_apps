import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + direction + gap + align + justify + wrap |
 * | UX | Flexbox layout primitive with optional divider insertion between children |
 * | Design | Eliminates manual gap/flex classes; pairs with Container for page-level composition |
 */
const meta = {
  title: 'Components/Layout/Stack',
  component: Stack,
  parameters: {
    docs: {
      description: {
        component:
          'A flexbox layout primitive for consistent spacing between child elements. Supports four directions, seven gap sizes, five alignment options, six justify modes, optional wrapping, and an optional divider element inserted between children.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    direction: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
      table: {
        category: 'Layout',
        type: { summary: "'row' | 'column' | 'row-reverse' | 'column-reverse'" },
        defaultValue: { summary: 'column' },
      },
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      table: {
        category: 'Layout',
        type: { summary: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'" },
        defaultValue: { summary: 'md' },
      },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      table: {
        category: 'Layout',
        type: { summary: "'start' | 'center' | 'end' | 'stretch' | 'baseline'" },
        defaultValue: { summary: 'stretch' },
      },
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      table: {
        category: 'Layout',
        type: { summary: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'" },
        defaultValue: { summary: 'start' },
      },
    },
    wrap: {
      control: 'boolean',
      table: {
        category: 'Layout',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    divider: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    children: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
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
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => (
  <div className="rounded-md border border-border bg-muted/50 px-4 py-2 text-sm">{label}</div>
);

// --- BASIC USAGE ---

/**
 * Default vertical stack with medium gap and three child items.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
    children: (
      <>
        <Box label="Item 1" />
        <Box label="Item 2" />
        <Box label="Item 3" />
      </>
    ),
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a gradient background, useful for overlay compositions.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Stack {...args}>
        <Box label="Item 1" />
        <Box label="Item 2" />
        <Box label="Item 3" />
      </Stack>
    </div>
  ),
};

/**
 * Cyber variant for terminal-style stacked layouts.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
  },
};

// --- DIRECTION VARIANTS ---

/**
 * Horizontal (row) stack showing items laid out left to right.
 */
export const Horizontal: Story = {
  args: {
    ...Basic.args,
    direction: 'row',
  },
};

// --- GAP VARIANTS ---

/**
 * All seven gap sizes compared side by side in horizontal stacks.
 */
export const GapSizes: Story = {
  render: () => (
    <div className="space-y-5">
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((g) => (
        <div key={g}>
          <p className="mb-1 text-xs font-medium text-muted-foreground">gap=&quot;{g}&quot;</p>
          <Stack direction="row" gap={g}>
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Stack>
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Stack with a divider element inserted between each child.
 */
export const WithDivider: Story = {
  args: {
    ...Basic.args,
    divider: <hr className="border-border" />,
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="Section 1" />
      <Box label="Section 2" />
      <Box label="Section 3" />
    </Stack>
  ),
};

/**
 * Row stack with justify=between and align=center, typical for header/toolbar layouts.
 */
export const JustifyBetween: Story = {
  args: {
    direction: 'row',
    gap: 'md',
    justify: 'between',
    align: 'center',
  },
  render: (args) => (
    <Stack {...args} className="rounded-lg border border-border bg-muted/20 px-4 py-2">
      <span className="text-sm font-semibold">Title</span>
      <div className="flex gap-2">
        <Box label="Action A" />
        <Box label="Action B" />
      </div>
    </Stack>
  ),
};
