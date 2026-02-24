import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { InvitationForm } from '@aazucena/forms/templates';

/**
 * ## InvitationForm
 * Team member invitation form — captures email, role (viewer/editor/admin/owner),
 * optional personal message, expiry window, and send-copy toggle.
 */
const meta = {
  title: 'Forms/Auth/InvitationForm',
  component: InvitationForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed invitation form using `invitationSchema`. Use this to invite collaborators with role-based access and optional expiry.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance' },
    },
    onSuccess: { table: { category: 'Events' } },
    onError: { table: { category: 'Events' } },
  },
  args: {
    onSuccess: fn(),
    onError: fn(),
  },
} satisfies Meta<typeof InvitationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 p-8 backdrop-blur">
        <Story />
      </div>
    ),
  ],
};

export const Cyber: Story = {
  args: { variant: 'cyber' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl border border-cyan-500/20 bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const WithDefaultValues: Story = {
  args: {
    variant: 'default',
    defaultValues: {
      email: 'colleague@company.com',
      role: 'editor',
      expiresInDays: '14',
      sendCopy: true,
    },
  },
};
