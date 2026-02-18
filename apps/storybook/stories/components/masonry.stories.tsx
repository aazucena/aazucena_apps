import type { Meta, StoryObj } from '@storybook/react-vite';
import { Masonry } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** CSS-columns masonry layout with zero JavaScript layout calculation.
 * - **UX:** Items flow naturally into columns with `break-inside: avoid` preventing splits.
 * - **Design:** Supports fixed column count or responsive breakpoints via Tailwind classes.
 * - **Accessibility:** Standard flow layout — no absolute positioning or aria roles needed.
 */
const meta = {
  title: 'Components/Layout/Masonry',
  component: Masonry,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CSS-columns masonry layout container. Items flow into columns naturally with break-inside avoidance. Supports fixed or responsive column counts and custom gap spacing.',
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
    columns: {
      control: 'number',
      description: 'Number of columns (or responsive object)',
      table: { category: 'Layout', defaultValue: { summary: '3' } },
    },
    gap: {
      control: 'number',
      description: 'Gap between items in pixels',
      table: { category: 'Layout', defaultValue: { summary: '16' } },
    },
  },
} satisfies Meta<typeof Masonry>;

export default meta;
type Story = StoryObj<typeof meta>;

const heights = [120, 200, 160, 80, 240, 140, 100, 180, 220, 130, 170, 90];

const cards = heights.map((h, i) => (
  <div
    key={i}
    className="flex items-center justify-center rounded-lg border bg-muted/30 text-sm font-medium"
    style={{ height: h }}
  >
    Card {i + 1} ({h}px)
  </div>
));

export const Basic: Story = {
  args: { columns: 3, gap: 16 },
  render: (args) => <Masonry {...args}>{cards}</Masonry>,
};

export const TwoColumns: Story = {
  args: { columns: 2, gap: 12 },
  render: (args) => <Masonry {...args}>{cards}</Masonry>,
};

export const Glass: Story = {
  args: { variant: 'glass', columns: 3, gap: 16 },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Masonry {...args}>{cards}</Masonry>
    </div>
  ),
};

export const Cyber: Story = {
  args: { variant: 'cyber', columns: 3, gap: 16 },
  render: (args) => <Masonry {...args}>{cards}</Masonry>,
};

export const ResponsiveColumns: Story = {
  args: { columns: { sm: 1, md: 2, lg: 4 }, gap: 16 },
  render: (args) => <Masonry {...args}>{cards}</Masonry>,
};
