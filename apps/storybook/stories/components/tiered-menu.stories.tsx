import type { Meta, StoryObj } from '@storybook/react-vite';
import { TieredMenu } from '@aazucena/ui';
import { within, userEvent, expect } from 'storybook/test';

const basicItems = [
  {
    label: 'New',
    children: [{ label: 'Project' }, { label: 'File' }, { label: 'Template' }],
  },
  { label: 'Open', command: '\u2318O' },
  { label: 'Save', command: '\u2318S' },
  { label: '', separator: true },
  {
    label: 'Export',
    children: [{ label: 'PDF' }, { label: 'CSV' }, { label: 'JSON' }],
  },
  { label: '', separator: true },
  { label: 'Preferences' },
  { label: 'Quit', command: '\u2318Q' },
];

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) |
 * | UX | Nested flyout menus — hovering a parent opens submenu to the right |
 * | Design | Supports keyboard shortcuts, separators, icons, and custom triggers |
 */
const meta = {
  title: 'Components/Navigation/TieredMenu',
  component: TieredMenu,
  parameters: {
    docs: {
      description: {
        component:
          'A nested flyout menu where hovering a parent item, or pressing Arrow Right on it, opens a submenu to the right. Arrow keys move between items and Escape closes the menu. Supports keyboard command shortcuts, separators, icons, disabled items, and custom trigger elements.',
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
      <div className="w-96 min-h-[300px] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TieredMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { items: basicItems },
};

/** Opens, moves into a submenu and closes with the keyboard alone. */
export const Keyboard: Story = {
  args: { items: basicItems },
  tags: ['!autodocs'],
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /menu/i });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const first = await canvas.findByRole('menuitem', { name: /new/i });
    await expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(await canvas.findByRole('menuitem', { name: /project/i })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: /^file$/i })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(first).toHaveFocus();
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const WithCommands: Story = {
  args: { items: basicItems },
};

export const Glass: Story = {
  args: { items: basicItems, variant: 'glass' },
  render: (args) => (
    <div className="rounded-card p-8">
      <TieredMenu {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { items: basicItems, variant: 'cyber' },
};

export const Separators: Story = {
  args: {
    items: [
      { label: 'Cut', command: '\u2318X' },
      { label: 'Copy', command: '\u2318C' },
      { label: 'Paste', command: '\u2318V' },
      { label: '', separator: true },
      { label: 'Select All', command: '\u2318A' },
      { label: '', separator: true },
      { label: 'Find', command: '\u2318F' },
      { label: 'Replace', command: '\u2318H' },
    ],
  },
};
