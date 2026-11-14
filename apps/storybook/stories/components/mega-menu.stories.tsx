import type { Meta, StoryObj } from '@storybook/react-vite';
import { MegaMenu } from '@aazucena/ui';
import { within, userEvent, expect } from 'storybook/test';

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const ServerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="8" x="2" y="2" rx="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" />
    <path d="M6 6h.01M6 18h.01" />
  </svg>
);

const basicItems = [
  {
    label: 'Products',
    children: [
      { label: 'Analytics', description: 'Track user behavior and conversions' },
      { label: 'Security', description: 'Protect your data and applications' },
      { label: 'Infrastructure', description: 'Deploy and scale globally' },
      { label: 'Monitoring', description: 'Real-time observability platform' },
    ],
  },
  {
    label: 'Solutions',
    children: [
      { label: 'Enterprise', description: 'For large organizations' },
      { label: 'Startups', description: 'Get started quickly' },
      { label: 'Education', description: 'Free for students' },
    ],
  },
  { label: 'Pricing', href: '#' },
  { label: 'Docs', href: '#' },
];

const iconItems = [
  {
    label: 'Products',
    children: [
      { label: 'Analytics', description: 'Track user behavior', icon: <ChartIcon /> },
      { label: 'Security', description: 'Protect your data', icon: <ShieldIcon /> },
      { label: 'Infrastructure', description: 'Deploy globally', icon: <ServerIcon /> },
    ],
  },
  { label: 'Pricing', href: '#' },
];

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) |
 * | UX | Wide dropdown panel with grouped links in columns on hover, click or Enter |
 * | Accessibility | Disclosure navigation: `aria-expanded` buttons, Arrow Down enters the panel, Escape closes and restores focus |
 * | Design | Supports icons, descriptions, and configurable column count |
 */
const meta = {
  title: 'Components/Navigation/MegaMenu',
  component: MegaMenu,
  parameters: {
    docs: {
      description: {
        component:
          'A horizontal navigation bar where hovering or activating a trigger reveals a wide dropdown panel with grouped links in columns. Supports icons, descriptions, and configurable column layouts.',
      },
    },
  },
  tags: ['autodocs', 'new', 'interaction-test'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full min-h-[300px] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MegaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { items: basicItems },
};

/** The panel opens, is entered and closes from the keyboard. */
export const Keyboard: Story = {
  args: { items: basicItems },
  tags: ['!autodocs'],
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const products = canvas.getByRole('button', { name: /products/i });
    await expect(products).toHaveAttribute('aria-expanded', 'false');
    products.focus();
    await userEvent.keyboard('{Enter}');
    await expect(products).toHaveAttribute('aria-expanded', 'true');
    const links = within(canvas.getByRole('list', { name: /products/i })).getAllByRole('link');
    await userEvent.tab();
    await expect(links[0]).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(products).toHaveAttribute('aria-expanded', 'false');
    await expect(products).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      within(canvas.getByRole('list', { name: /products/i })).getAllByRole('link')[0],
    ).toHaveFocus();
  },
};

export const WithIcons: Story = {
  args: { items: iconItems },
};

export const Glass: Story = {
  args: { items: basicItems, variant: 'glass' },
  render: (args) => (
    <div className="rounded-card p-8">
      <MegaMenu {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { items: basicItems, variant: 'cyber' },
};

export const MultiColumn: Story = {
  args: {
    items: [
      {
        label: 'All Services',
        columns: 4,
        children: [
          { label: 'Analytics', description: 'Track behavior' },
          { label: 'Security', description: 'Protect data' },
          { label: 'Infrastructure', description: 'Deploy globally' },
          { label: 'Monitoring', description: 'Observability' },
          { label: 'Logging', description: 'Centralized logs' },
          { label: 'CDN', description: 'Edge delivery' },
          { label: 'Storage', description: 'Object storage' },
          { label: 'Compute', description: 'Serverless functions' },
        ],
      },
    ],
  },
};
