import type { Meta, StoryObj } from '@storybook/react';
import { Spoiler } from '@aazucena/ui';
import { within, userEvent, expect } from '@storybook/test';

const loremText = (
  <>
    <p className="mb-2">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris.
    </p>
    <p className="mb-2">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident.
    </p>
    <p>
      Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis
      iste natus error sit voluptatem accusantium doloremque laudantium.
    </p>
  </>
);

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) |
 * | UX | Content collapses to maxHeight with gradient fade and toggle button |
 * | Design | Smooth CSS height transition, configurable labels |
 */
const meta = {
  title: 'Components/Display/Spoiler',
  component: Spoiler,
  parameters: {
    docs: {
      description: {
        component:
          'A content container that collapses to a configurable maxHeight with a gradient fade overlay and a "Show more" toggle button. Expands/collapses with smooth transitions.',
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
    maxHeight: {
      control: { type: 'number', min: 40, max: 300 },
      table: { category: 'Appearance', defaultValue: { summary: '100' } },
    },
    showLabel: {
      control: 'text',
      table: { category: 'Content', defaultValue: { summary: 'Show more' } },
    },
    hideLabel: {
      control: 'text',
      table: { category: 'Content', defaultValue: { summary: 'Show less' } },
    },
    defaultOpen: {
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Spoiler>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { children: loremText },
};

export const CustomLabels: Story = {
  args: { children: loremText, showLabel: 'Read more', hideLabel: 'Collapse' },
};

export const Glass: Story = {
  args: { variant: 'glass', children: loremText },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Spoiler {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { variant: 'cyber', children: loremText },
};

export const DefaultOpen: Story = {
  args: { children: loremText, defaultOpen: true },
};

export const TallContent: Story = {
  args: { children: loremText, maxHeight: 60 },
};

/**
 * Automated interaction test: click 'Show more' to reveal content.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  args: { children: loremText },
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Find the show more button
    const showMore = canvas.getByRole('button', { name: /show more/i });
    await expect(showMore).toBeVisible();
    // Click to expand
    await userEvent.click(showMore);
    // Now the hide button should appear
    const hideBtn = canvas.getByRole('button', { name: /show less/i });
    await expect(hideBtn).toBeVisible();
    // Collapse again
    await userEvent.click(hideBtn);
    await expect(canvas.getByRole('button', { name: /show more/i })).toBeVisible();
  },
};
