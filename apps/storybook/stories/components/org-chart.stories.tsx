import type { Meta, StoryObj } from '@storybook/react';
import { OrgChart } from '@aazucena/ui';

const sampleData = {
  id: '1',
  label: 'Sarah Chen',
  title: 'CEO',
  children: [
    {
      id: '2',
      label: 'Marcus Johnson',
      title: 'CTO',
      children: [
        {
          id: '4',
          label: 'Emily Park',
          title: 'VP Engineering',
          children: [
            { id: '7', label: 'Alex Rivera', title: 'Sr. Engineer' },
            { id: '8', label: 'Jordan Lee', title: 'Sr. Engineer' },
          ],
        },
        { id: '5', label: 'David Kim', title: 'VP Product' },
      ],
    },
    {
      id: '3',
      label: 'Lisa Wang',
      title: 'CFO',
      children: [{ id: '6', label: 'Rachel Green', title: 'Finance Director' }],
    },
  ],
};

const avatarData = {
  ...sampleData,
  avatar: 'https://i.pravatar.cc/150?u=sarah',
  children: sampleData.children?.map((c, i) => ({
    ...c,
    avatar: `https://i.pravatar.cc/150?u=child${i}`,
    children: c.children?.map((gc, j) => ({
      ...gc,
      avatar: `https://i.pravatar.cc/150?u=gc${i}${j}`,
      children: gc.children?.map((ggc, k) => ({
        ...ggc,
        avatar: `https://i.pravatar.cc/150?u=ggc${i}${j}${k}`,
      })),
    })),
  })),
};

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) |
 * | UX | Tree-structured org chart with card nodes and CSS connector lines |
 * | Design | Pure CSS lines (no D3/canvas), supports expand/collapse |
 */
const meta = {
  title: 'Components/Data Display/OrgChart',
  component: OrgChart,
  parameters: {
    docs: {
      description: {
        component:
          'A tree-structured organizational chart with card nodes connected by CSS-drawn lines. Each node shows avatar/name/title. Supports expand/collapse of branches, horizontal layout, and all three visual variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    horizontal: {
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full min-h-[400px] overflow-auto p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OrgChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { data: sampleData },
};

export const Horizontal: Story = {
  args: { data: sampleData, horizontal: true },
};

export const Glass: Story = {
  args: { data: sampleData, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <OrgChart {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { data: sampleData, variant: 'cyber' },
};

export const WithAvatars: Story = {
  args: { data: avatarData },
};

export const Collapsible: Story = {
  args: { data: sampleData, onNodeClick: undefined },
};
