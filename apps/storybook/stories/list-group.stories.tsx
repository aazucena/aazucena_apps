import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListGroup, ListGroupItem } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Bordered list container with interactive items supporting icons, actions, and active states.
 * - **UX:** Hover and active states for navigation menus, settings panels, and action collections.
 * - **Design:** Clean bordered container with row separators. Compound component pattern (ListGroup + ListGroupItem).
 */
const meta = {
  title: 'Components/Data Display/ListGroup',
  component: ListGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interactive list group for menus, settings panels, and action collections. Compound component with ListGroup container and ListGroupItem rows supporting icons, actions, and active/button states.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant for the container and items',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: "'default'" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard list group with descriptive items, simulating a settings menu.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <ListGroup variant={args.variant}>
      <ListGroupItem variant={args.variant}>Profile Settings</ListGroupItem>
      <ListGroupItem variant={args.variant}>Notifications</ListGroupItem>
      <ListGroupItem variant={args.variant}>Security</ListGroupItem>
      <ListGroupItem variant={args.variant}>Billing</ListGroupItem>
    </ListGroup>
  ),
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for overlaying gradient or image backgrounds.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <ListGroup variant={args.variant}>
        <ListGroupItem variant={args.variant}>Dashboard</ListGroupItem>
        <ListGroupItem variant={args.variant} active>Analytics</ListGroupItem>
        <ListGroupItem variant={args.variant}>Reports</ListGroupItem>
      </ListGroup>
    </div>
  ),
};

/**
 * Cyber variant with monospace font and cyan accents for terminal-style UIs.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <ListGroup variant={args.variant}>
      <ListGroupItem variant={args.variant}>FIREWALL_CONFIG</ListGroupItem>
      <ListGroupItem variant={args.variant} active>ACCESS_CONTROL</ListGroupItem>
      <ListGroupItem variant={args.variant}>AUDIT_LOG</ListGroupItem>
      <ListGroupItem variant={args.variant}>NETWORK_MAP</ListGroupItem>
    </ListGroup>
  ),
};

// --- ADVANCED ---

/**
 * Items with active state highlighting, simulating a navigation sidebar.
 */
export const WithActiveState: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem active>Dashboard</ListGroupItem>
      <ListGroupItem>Analytics</ListGroupItem>
      <ListGroupItem>Reports</ListGroupItem>
      <ListGroupItem>Settings</ListGroupItem>
    </ListGroup>
  ),
};

/**
 * Items with icon and action slots demonstrating the full composition API.
 */
export const WithIconsAndActions: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        }
        action={<span className="text-xs text-muted-foreground">Admin</span>}
      >
        Profile
      </ListGroupItem>
      <ListGroupItem
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        }
        action={<span className="rounded-full bg-destructive px-1.5 text-[10px] text-white">3</span>}
      >
        Notifications
      </ListGroupItem>
      <ListGroupItem
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        }
        asButton
      >
        Security
      </ListGroupItem>
    </ListGroup>
  ),
};

/**
 * Interactive button-style items with cursor pointer and tab focus.
 */
export const ButtonItems: Story = {
  render: () => (
    <ListGroup>
      <ListGroupItem asButton onClick={() => {}}>Create New Project</ListGroupItem>
      <ListGroupItem asButton onClick={() => {}}>Import from GitHub</ListGroupItem>
      <ListGroupItem asButton onClick={() => {}}>Browse Templates</ListGroupItem>
    </ListGroup>
  ),
};
