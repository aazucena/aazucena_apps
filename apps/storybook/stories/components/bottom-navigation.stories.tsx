import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomNavigation, BottomNavigationItem } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Mobile-first bottom navigation bar with icon + label items.
 * - **UX:** Fixed to viewport bottom with safe-area padding for mobile notches.
 * - **Design:** Three variants (default, glass, cyber) with compound active-state styling.
 * - **Accessibility:** Uses `role="navigation"` with `aria-current="page"` for active items.
 */
const meta = {
  title: 'Components/Navigation/BottomNavigation',
  component: BottomNavigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Fixed bottom navigation bar for mobile interfaces. Supports icon + label items with active state indicators across default, glass, and cyber variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Height of the navigation bar',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: { category: 'Styling' },
    },
  },
  decorators: [
    (Story) => (
      <div className="relative h-80 w-[24rem] overflow-hidden rounded-xl border bg-background">
        <div className="p-4 text-sm text-muted-foreground">Page content area</div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// --- BASIC USAGE ---

/**
 * Standard bottom navigation with four items and one active.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'md',
  },
  render: (args) => (
    <BottomNavigation {...args}>
      <BottomNavigationItem icon={<HomeIcon />} label="Home" active />
      <BottomNavigationItem icon={<SearchIcon />} label="Search" />
      <BottomNavigationItem icon={<UserIcon />} label="Profile" />
      <BottomNavigationItem icon={<SettingsIcon />} label="Settings" />
    </BottomNavigation>
  ),
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for immersive transparent layouts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <div className="relative h-64 overflow-hidden rounded-xl">
        <BottomNavigation {...args}>
          <BottomNavigationItem variant="glass" icon={<HomeIcon />} label="Home" active />
          <BottomNavigationItem variant="glass" icon={<SearchIcon />} label="Search" />
          <BottomNavigationItem variant="glass" icon={<UserIcon />} label="Profile" />
        </BottomNavigation>
      </div>
    </div>
  ),
};

/**
 * Neon-accented cyber variant for terminal-style interfaces.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
  },
  render: (args) => (
    <BottomNavigation {...args}>
      <BottomNavigationItem variant="cyber" icon={<HomeIcon />} label="NODE" active />
      <BottomNavigationItem variant="cyber" icon={<SearchIcon />} label="SCAN" />
      <BottomNavigationItem variant="cyber" icon={<UserIcon />} label="AGENT" />
      <BottomNavigationItem variant="cyber" icon={<SettingsIcon />} label="SYS" />
    </BottomNavigation>
  ),
};

// --- SIZE VARIANTS ---

/**
 * Comparison of all three height presets from compact to spacious.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <p className="mb-1 text-xs font-mono text-muted-foreground">size=&quot;{s}&quot;</p>
          <div className="relative h-24 overflow-hidden rounded-xl border bg-background">
            <BottomNavigation size={s}>
              <BottomNavigationItem icon={<HomeIcon />} label="Home" active />
              <BottomNavigationItem icon={<SearchIcon />} label="Search" />
              <BottomNavigationItem icon={<UserIcon />} label="Profile" />
            </BottomNavigation>
          </div>
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Icon-only navigation without labels for ultra-compact mobile UIs.
 */
export const IconOnly: Story = {
  args: {
    ...Basic.args,
    size: 'sm',
  },
  render: (args) => (
    <BottomNavigation {...args}>
      <BottomNavigationItem icon={<HomeIcon />} active />
      <BottomNavigationItem icon={<SearchIcon />} />
      <BottomNavigationItem icon={<UserIcon />} />
      <BottomNavigationItem icon={<SettingsIcon />} />
    </BottomNavigation>
  ),
};
