import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + size (sm / default / lg) |
 * | UX | Composites Avatar with name/description for user identity display |
 * | Design | Auto-generates initials from name when no avatar image provided |
 */
const meta = {
  title: 'Components/Display/User',
  component: User,
  parameters: {
    docs: {
      description: {
        component:
          'A user identity component composing Avatar with name and optional description. Automatically generates initials from the name when no avatar image is provided.',
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
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    name: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    description: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    avatarSrc: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof User>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { name: 'John Doe', description: 'Software Engineer' },
};

export const WithImage: Story = {
  args: {
    name: 'Jane Smith',
    description: 'Product Designer',
    avatarSrc: 'https://i.pravatar.cc/150?u=a',
  },
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <User {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { name: 'OPERATOR_01', description: 'sys.admin', variant: 'cyber' },
};

export const Sizes: Story = {
  args: {
    name: 'Alex Chen',
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'default', 'lg'] as const).map((s) => (
        <User key={s} size={s} name="Alex Chen" description={`Size: ${s}`} />
      ))}
    </div>
  ),
};

export const UserList: Story = {
  args: {
    name: 'User List',
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <User
        name="Alice Johnson"
        description="Frontend Engineer"
        avatarSrc="https://i.pravatar.cc/150?u=alice"
      />
      <User
        name="Bob Williams"
        description="Backend Engineer"
        avatarSrc="https://i.pravatar.cc/150?u=bob"
      />
      <User
        name="Carol Davis"
        description="DevOps Engineer"
        avatarSrc="https://i.pravatar.cc/150?u=carol"
      />
    </div>
  ),
};
