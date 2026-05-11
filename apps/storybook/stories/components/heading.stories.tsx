import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Semantic heading component replacing raw `<h1>`-`<h6>` elements.
 * - **UX:** Decouples visual size from heading level so an `h2` can render at `h4` visual scale.
 * - **Design:** Maps heading levels to the design-system typography scale with five visual variants.
 * - **Accessibility:** Produces the correct HTML element for screen-reader heading hierarchy.
 */
const meta = {
  title: 'Components/Typography/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic heading component with variant styling. Decouples visual size from heading level for flexible, accessible typography. Supports default, glass, cyber, muted, and gradient variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'muted', 'gradient'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'muted' | 'gradient'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Visual size of the heading (maps to typography scale)',
      table: {
        category: 'Appearance',
        type: { summary: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'" },
        defaultValue: { summary: 'h2' },
      },
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Override the rendered HTML element independently of visual size',
      table: {
        category: 'Semantic',
        type: { summary: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'" },
        defaultValue: { summary: 'derived from size' },
      },
    },
    children: {
      control: 'text',
      description: 'Heading text content',
      table: { category: 'Content' },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: { category: 'Styling' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[32rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard heading with default styling at the h2 visual size.
 */
export const Basic: Story = {
  args: {
    children: 'System Architecture',
    variant: 'default',
    size: 'h2',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Transparent variant with drop-shadow for immersive glassmorphic layouts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    children: 'Immersive Display',
    variant: 'glass',
    size: 'h1',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Heading {...args} />
    </div>
  ),
};

/**
 * High-contrast monospaced variant for terminal and technical interfaces.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    children: 'NEURAL_NETWORK_v3.2',
    variant: 'cyber',
    size: 'h1',
  },
};

/**
 * Subdued variant for secondary or supporting headings.
 */
export const Muted: Story = {
  args: {
    ...Basic.args,
    children: 'Supporting Context',
    variant: 'muted',
    size: 'h3',
  },
};

/**
 * Eye-catching gradient text effect for hero or marketing headings.
 */
export const Gradient: Story = {
  args: {
    ...Basic.args,
    children: 'Build Something Amazing',
    variant: 'gradient',
    size: 'h1',
  },
};

// --- SIZE VARIANTS ---

/**
 * Full heading hierarchy showing all six size tiers side-by-side.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading size="h1">h1 — Page Title</Heading>
      <Heading size="h2">h2 — Section Header</Heading>
      <Heading size="h3">h3 — Subsection</Heading>
      <Heading size="h4">h4 — Group Label</Heading>
      <Heading size="h5">h5 — Detail Heading</Heading>
      <Heading size="h6">h6 — Minor Heading</Heading>
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Demonstrates using `as` to decouple semantic level from visual size.
 * Here an `h2` element renders at the h4 visual scale.
 */
export const SemanticOverride: Story = {
  args: {
    children: 'Visually small, semantically h2',
    as: 'h2',
    size: 'h4',
    variant: 'default',
  },
};
