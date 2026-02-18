import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationCenter, type NotificationItemData } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Popover-based notification center composing Popover + ScrollArea + Badge.
 * - **UX:** Bell icon with unread count badge; popover with scrollable notification list.
 * - **Design:** Split into NotificationCenter (container) and NotificationItem (row) for maintainability.
 * - **Accessibility:** Popover trigger and items are focusable; dismiss buttons have aria-labels.
 */
const meta = {
  title: 'Components/Feedback/NotificationCenter',
  component: NotificationCenter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Notification center with bell icon trigger, unread count badge, and scrollable popover dropdown. Supports read/dismiss/mark-all-read actions with three visual variants.',
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
  },
} satisfies Meta<typeof NotificationCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleNotifications: NotificationItemData[] = [
  { id: '1', title: 'New deployment', description: 'Production build v3.2.1 deployed successfully.', time: '2 min ago', read: false },
  { id: '2', title: 'Comment on PR #42', description: 'Alice left a comment on your pull request.', time: '15 min ago', read: false },
  { id: '3', title: 'Build passed', description: 'CI pipeline completed without errors.', time: '1 hour ago', read: true },
  { id: '4', title: 'New team member', description: 'Bob joined the engineering team.', time: '3 hours ago', read: true },
  { id: '5', title: 'Security alert', description: 'Dependency vulnerability detected in lodash.', time: 'Yesterday', read: false },
];

export const Basic: Story = {
  args: {
    notifications: sampleNotifications,
    onRead: (id) => console.log('Read:', id),
    onDismiss: (id) => console.log('Dismiss:', id),
    onMarkAllRead: () => console.log('Mark all read'),
  },
};

export const WithUnread: Story = {
  args: {
    notifications: sampleNotifications.map((n) => ({ ...n, read: false })),
    onRead: (id) => console.log('Read:', id),
    onMarkAllRead: () => console.log('Mark all read'),
  },
};

export const Empty: Story = {
  args: { notifications: [] },
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <NotificationCenter {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { ...Basic.args, variant: 'cyber' },
};

export const CustomTrigger: Story = {
  args: {
    ...Basic.args,
    trigger: <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Messages (3)</button>,
  },
};
