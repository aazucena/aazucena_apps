import type { Meta, StoryObj } from '@storybook/react';
import { PanelMenu } from '@aazucena/ui';

const basicItems = [
  { label: 'Dashboard' },
  {
    label: 'Users',
    children: [{ label: 'Active Users' }, { label: 'Groups' }, { label: 'Permissions' }],
  },
  {
    label: 'Settings',
    children: [
      { label: 'General' },
      {
        label: 'Security',
        children: [{ label: 'Passwords' }, { label: 'Two-Factor Auth' }],
      },
      { label: 'Notifications' },
    ],
  },
  { label: 'Reports' },
];

const iconItems = [
  {
    label: 'Dashboard',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Users',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    children: [{ label: 'Active' }, { label: 'Archived' }],
  },
  {
    label: 'Settings',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) |
 * | UX | Vertical accordion-style sidebar navigation with nested levels |
 * | Design | Self-contained collapsible sections with indentation |
 */
const meta = {
  title: 'Components/Navigation/PanelMenu',
  component: PanelMenu,
  parameters: {
    docs: {
      description: {
        component:
          'A vertical accordion-style menu where clicking a parent item expands its children inline. Supports deeply nested levels with indentation, icons, and href links.',
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
  },
  decorators: [
    (Story) => (
      <div className="w-72 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PanelMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { items: basicItems },
};

export const Nested: Story = {
  args: { items: basicItems },
};

export const Glass: Story = {
  args: { items: basicItems, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <PanelMenu {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { items: basicItems, variant: 'cyber' },
};

export const WithIcons: Story = {
  args: { items: iconItems },
};
