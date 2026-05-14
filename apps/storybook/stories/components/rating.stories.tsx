import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating } from '@aazucena/ui';
import { useState } from 'react';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + size (sm / md / lg / xl) |
 * | UX | Interactive star rating with keyboard navigation, hover preview, and optional half-star precision |
 * | Design | SVG stars with fill/half-fill/empty states; amber palette default, cyan for cyber |
 */
const meta = {
  title: 'Components/Forms/Rating',
  component: Rating,
  parameters: {
    docs: {
      description: {
        component:
          'An accessible star-rating input component. Supports interactive and read-only modes, half-star precision, configurable max stars, and keyboard navigation (Enter/Space to select). Built with inline SVG stars and CVA variants.',
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
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' },
      },
    },
    value: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '5' },
      },
    },
    readOnly: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    precision: {
      control: 'select',
      options: ['full', 'half'],
      table: {
        category: 'Behavior',
        type: { summary: "'full' | 'half'" },
        defaultValue: { summary: 'full' },
      },
    },
    onChange: {
      action: 'changed',
      table: {
        category: 'Behavior',
        type: { summary: '(value: number) => void' },
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
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Interactive rating with a default value of 3 stars. Click or use keyboard to change.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'md',
    value: 3,
    max: 5,
    readOnly: false,
    precision: 'full',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with translucent amber stars on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    value: 4,
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Rating {...args} />
    </div>
  ),
};

/**
 * Cyber variant with cyan-colored stars for dark terminal aesthetics.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    value: 4,
  },
};

// --- SIZE VARIANTS ---

/**
 * All four sizes rendered together for visual comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <div key={s} className="flex items-center gap-3">
          <span className="w-8 text-xs font-medium text-muted-foreground">{s.toUpperCase()}</span>
          <Rating value={4} size={s} readOnly />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Half-star precision mode displaying a 3.5-star read-only rating.
 */
export const HalfPrecision: Story = {
  args: {
    ...Basic.args,
    value: 3.5,
    precision: 'half',
    readOnly: true,
    size: 'lg',
  },
};

/**
 * Controlled interactive rating using React state. Demonstrates onChange integration.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="flex flex-col gap-2">
        <Rating value={value} onChange={setValue} size="lg" />
        <p className="text-sm text-muted-foreground">
          Selected: {value} / 5 star{value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  },
};
