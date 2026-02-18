import type { Meta, StoryObj } from '@storybook/react-vite';
import { VirtualList } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Scroll-virtualized list rendering only visible items for performance.
 * - **UX:** Handles thousands of items with constant DOM node count via translateY positioning.
 * - **Design:** Spacer div for total height maintains scrollbar accuracy; overscan prevents flicker.
 * - **Accessibility:** Standard scroll container semantics; items are real DOM nodes.
 */
const meta = {
  title: 'Components/Data Display/VirtualList',
  component: VirtualList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Scroll-virtualized list that renders only visible items plus an overscan buffer. Uses native scroll events and translateY positioning for zero-dependency performance.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    itemHeight: {
      control: 'number',
      description: 'Fixed height of each item in pixels',
      table: { category: 'Layout' },
    },
    overscan: {
      control: 'number',
      description: 'Extra items rendered above/below viewport',
      table: { category: 'Performance', defaultValue: { summary: '5' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[24rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: i, label: `Item ${i + 1}` }));

export const Basic: Story = {
  args: {
    items: makeItems(100),
    itemHeight: 40,
    height: 300,
    renderItem: (item: { id: number; label: string }) => (
      <div className="flex h-full items-center border-b px-4 text-sm">{item.label}</div>
    ),
  },
};

export const ThousandItems: Story = {
  args: {
    ...Basic.args,
    items: makeItems(10000),
  },
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <VirtualList {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { ...Basic.args, variant: 'cyber' },
};

export const VariableContent: Story = {
  args: {
    items: makeItems(200),
    itemHeight: 60,
    height: 400,
    renderItem: (item: { id: number; label: string }, index: number) => (
      <div className="flex h-full flex-col justify-center border-b px-4">
        <span className="text-sm font-medium">{item.label}</span>
        <span className="text-xs text-muted-foreground">Row {index + 1} of 200</span>
      </div>
    ),
  },
};
