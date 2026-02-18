import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarGroup, Avatar, AvatarImage, AvatarFallback } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Stacked avatar display with overflow count for team/group scenarios.
 * - **UX:** Limits visible avatars to `max` and shows a `+N` fallback for the remainder.
 * - **Design:** Negative-margin overlap creates the familiar social-platform cluster effect.
 * - **Accessibility:** Each avatar retains its own alt text; overflow count is visible text.
 */
const meta = {
  title: 'Components/Data Display/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Stacked avatar group with overflow indicator. Wraps Avatar components with negative-margin overlap and a +N count when children exceed the max limit.',
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
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the avatars',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    max: {
      control: 'number',
      description: 'Maximum visible avatars before showing overflow count',
      table: { category: 'Behavior', defaultValue: { summary: '5' } },
    },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const avatars = ['AA', 'BZ', 'CK', 'DM', 'EL', 'FG', 'HJ'];

const renderAvatars = (count: number) =>
  avatars.slice(0, count).map((initials, i) => (
    <Avatar key={i}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  ));

export const Basic: Story = {
  args: { max: 5 },
  render: (args) => <AvatarGroup {...args}>{renderAvatars(5)}</AvatarGroup>,
};

export const Overflow: Story = {
  args: { max: 3 },
  render: (args) => <AvatarGroup {...args}>{renderAvatars(7)}</AvatarGroup>,
};

export const Glass: Story = {
  args: { variant: 'glass', max: 4 },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <AvatarGroup {...args}>{renderAvatars(6)}</AvatarGroup>
    </div>
  ),
};

export const Cyber: Story = {
  args: { variant: 'cyber', max: 4 },
  render: (args) => <AvatarGroup {...args}>{renderAvatars(6)}</AvatarGroup>,
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <AvatarGroup size="sm" max={4}>{renderAvatars(5)}</AvatarGroup>
      <AvatarGroup size="default" max={4}>{renderAvatars(5)}</AvatarGroup>
      <AvatarGroup size="lg" max={4}>{renderAvatars(5)}</AvatarGroup>
    </div>
  ),
};

export const WithImages: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=1" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=2" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=3" alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=4" alt="User 4" />
        <AvatarFallback>U4</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/40?img=5" alt="User 5" />
        <AvatarFallback>U5</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};
