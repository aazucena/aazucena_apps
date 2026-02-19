import type { Meta, StoryObj } from '@storybook/react-vite';
import { DetailNavigation } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Path-aware navigation system for sequential content (Portfolio projects, Blog posts).
 * - **UX:** Features large clickable areas with directional arrow animations on hover.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) for consistent technical depth.
 * - **Responsiveness:** Automatically stacks on mobile and handles missing items (single-sided navigation).
 */
const meta = {
  title: 'Components/Navigation/DetailNavigation',
  component: DetailNavigation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A navigation footer for detail pages that provides links to the previous and next items in a sequence.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual style of the navigation blocks',
      table: { category: 'Appearance' },
    },
    basePath: {
      control: 'text',
      description: 'The root path for generating full URLs',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof DetailNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing both previous and next links.
 */
export const Basic: Story = {
  args: {
    basePath: '/projects',
    prevItem: { slug: 'distributed-tracing', title: 'Distributed Tracing System' },
    nextItem: { slug: 'adaptive-shell', title: 'Adaptive Engineering Shell' },
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[800px]">
      <DetailNavigation {...args} />
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical labels.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    prevItem: { slug: 'node-01', title: 'PRIMARY_UPLINK_CORE' },
    nextItem: { slug: 'node-03', title: 'SECONDARY_BUFFER_NODE' },
    prevLabel: 'PREV_UNIT',
    nextLabel: 'NEXT_UNIT',
  },
  render: (args) => (
    <div className="w-[800px]">
      <DetailNavigation {...args} />
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for immersive portfolio layouts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-br from-zinc-900 to-black rounded-[3rem]">
      <div className="w-[800px]">
        <DetailNavigation {...args} />
      </div>
    </div>
  ),
};

/**
 * Demonstrates the layout when only one side of the navigation is available.
 */
export const SingleSided: Story = {
  args: {
    ...Basic.args,
    prevItem: null,
    nextItem: { slug: 'first-step', title: 'Beginning the Sequence' },
    nextLabel: 'START_JOURNEY',
  },
  render: (args) => (
    <div className="w-[800px]">
      <DetailNavigation {...args} />
    </div>
  ),
};
