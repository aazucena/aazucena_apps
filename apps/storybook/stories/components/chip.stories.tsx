import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber / outline / primary / destructive) + size (sm / md / lg) |
 * | UX | Compact interactive tag with optional leading icon and dismissible close button |
 * | Design | Distinct from Badge -- Chip implies user interaction (select, filter, remove) |
 */
const meta = {
  title: 'Components/Primitives/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component:
          'An interactive chip component for filters, tag selections, and removable items. Supports six visual variants, three sizes, an optional leading icon, and a dismissible close button. Built with rounded-full pill shape and CVA.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'outline', 'primary', 'destructive'],
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'outline' | 'primary' | 'destructive'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    icon: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onDismiss: {
      action: 'dismissed',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    disabled: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' },
      },
    },
    children: {
      control: 'text',
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
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Default chip with medium size, suitable for filter tags and selections.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'React',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a gradient background for frosted-glass UI compositions.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    children: 'TypeScript',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Chip {...args} />
    </div>
  ),
};

/**
 * Cyber variant with cyan border and mono font for terminal aesthetics.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    children: 'MODULE_ACTIVE',
  },
};

// --- SIZE VARIANTS ---

/**
 * All three sizes rendered together for visual comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Chip key={s} size={s}>
          {s.toUpperCase()}
        </Chip>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * All six variants displayed together showing the full visual range of the component.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['default', 'glass', 'cyber', 'outline', 'primary', 'destructive'] as const).map((v) => (
        <Chip key={v} variant={v}>
          {v}
        </Chip>
      ))}
    </div>
  ),
};

/**
 * Dismissible chips with close button, typical for active filter selections.
 */
export const Dismissible: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip onDismiss={() => {}}>Frontend</Chip>
      <Chip onDismiss={() => {}}>Backend</Chip>
      <Chip onDismiss={() => {}}>DevOps</Chip>
      <Chip variant="outline">+ Add Filter</Chip>
    </div>
  ),
};

/**
 * Disabled state showing reduced opacity and no pointer events.
 */
export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
    children: 'Disabled',
    onDismiss: () => {},
  },
};
