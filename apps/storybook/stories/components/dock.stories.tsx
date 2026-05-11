import type { Meta, StoryObj } from '@storybook/react';
import { Dock, DockItem } from '@aazucena/ui';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + position (bottom / top / left / right) |
 * | UX | macOS-style dock with magnification effect on hover |
 * | Design | CSS transform scaling — no heavy animation library needed |
 */
const meta = {
  title: 'Components/Navigation/Dock',
  component: Dock,
  parameters: {
    docs: {
      description: {
        component:
          'A macOS-style dock bar with magnification effect on hover. Items scale up as the cursor approaches using CSS transforms. Supports four positions and all three visual variants.',
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
    position: {
      control: 'select',
      options: ['bottom', 'top', 'left', 'right'],
      table: { category: 'Appearance', defaultValue: { summary: 'bottom' } },
    },
    magnification: {
      control: { type: 'number', min: 1, max: 3, step: 0.1 },
      table: { category: 'Behavior', defaultValue: { summary: '1.5' } },
    },
    distance: {
      control: { type: 'number', min: 50, max: 200 },
      table: { category: 'Behavior', defaultValue: { summary: '100' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[200px] items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Dock>
      <DockItem label="Home">
        <HomeIcon />
      </DockItem>
      <DockItem label="Search">
        <SearchIcon />
      </DockItem>
      <DockItem label="Mail">
        <MailIcon />
      </DockItem>
      <DockItem label="Profile">
        <UserIcon />
      </DockItem>
      <DockItem label="Settings">
        <SettingsIcon />
      </DockItem>
    </Dock>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Dock position="bottom">
        <DockItem label="Home">
          <HomeIcon />
        </DockItem>
        <DockItem label="Mail">
          <MailIcon />
        </DockItem>
        <DockItem label="Settings">
          <SettingsIcon />
        </DockItem>
      </Dock>
    </div>
  ),
};

export const Glass: Story = {
  render: () => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-12">
      <Dock variant="glass">
        <DockItem label="Home">
          <HomeIcon />
        </DockItem>
        <DockItem label="Search">
          <SearchIcon />
        </DockItem>
        <DockItem label="Mail">
          <MailIcon />
        </DockItem>
        <DockItem label="Profile">
          <UserIcon />
        </DockItem>
        <DockItem label="Settings">
          <SettingsIcon />
        </DockItem>
      </Dock>
    </div>
  ),
};

export const Cyber: Story = {
  render: () => (
    <Dock variant="cyber">
      <DockItem label="HOME">
        <HomeIcon />
      </DockItem>
      <DockItem label="SCAN">
        <SearchIcon />
      </DockItem>
      <DockItem label="COMMS">
        <MailIcon />
      </DockItem>
      <DockItem label="IDENT">
        <UserIcon />
      </DockItem>
      <DockItem label="CONFIG">
        <SettingsIcon />
      </DockItem>
    </Dock>
  ),
};

export const NoMagnification: Story = {
  render: () => (
    <Dock magnification={1}>
      <DockItem label="Home">
        <HomeIcon />
      </DockItem>
      <DockItem label="Search">
        <SearchIcon />
      </DockItem>
      <DockItem label="Mail">
        <MailIcon />
      </DockItem>
    </Dock>
  ),
};
