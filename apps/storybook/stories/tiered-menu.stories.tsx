import type { Meta, StoryObj } from '@storybook/react';
import { TieredMenu } from '@aazucena/ui';

const basicItems = [
  {
    label: 'New',
    children: [
      { label: 'Project' },
      { label: 'File' },
      { label: 'Template' },
    ],
  },
  { label: 'Open', command: '\u2318O' },
  { label: 'Save', command: '\u2318S' },
  { label: '', separator: true },
  {
    label: 'Export',
    children: [
      { label: 'PDF' },
      { label: 'CSV' },
      { label: 'JSON' },
    ],
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
          'A nested flyout menu where hovering a parent item opens a submenu to the right. Supports keyboard command shortcuts, separators, icons, disabled items, and custom trigger elements.',
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

export const WithCommands: Story = {
  args: { items: basicItems },
};

export const Glass: Story = {
  args: { items: basicItems, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
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
