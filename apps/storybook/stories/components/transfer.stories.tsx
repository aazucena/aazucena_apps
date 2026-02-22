import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Transfer } from '@aazucena/ui';

const items = [
  { key: '1', label: 'React' },
  { key: '2', label: 'Vue' },
  { key: '3', label: 'Angular' },
  { key: '4', label: 'Svelte' },
  { key: '5', label: 'Solid' },
  { key: '6', label: 'Preact' },
];

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + size (sm / md / lg) |
 * | UX | Dual-list shuttle with checkboxes, move buttons, optional search |
 * | Design | Select-all header, item count, disabled item support |
 */
const meta = {
  title: 'Components/Forms/Transfer',
  component: Transfer,
  parameters: {
    docs: {
      description: {
        component:
          'A dual-list transfer component for moving items between source and target lists. Supports checkboxes, select-all, search filtering, and keyboard navigation.',
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
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    searchable: {
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Behavior' },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Transfer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    items,
    targetKeys: ['3'],
    onChange: () => {},
  },
  render: () => {
    const [targetKeys, setTargetKeys] = React.useState<string[]>(['3']);
    return <Transfer items={items} targetKeys={targetKeys} onChange={setTargetKeys} />;
  },
};

export const Searchable: Story = {
  args: {
    items,
    targetKeys: [],
    onChange: () => {},
  },
  render: () => {
    const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
    return <Transfer items={items} targetKeys={targetKeys} onChange={setTargetKeys} searchable />;
  },
};

export const Glass: Story = {
  args: {
    items,
    targetKeys: [],
    onChange: () => {},
  },
  render: () => {
    const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Transfer variant="glass" items={items} targetKeys={targetKeys} onChange={setTargetKeys} />
      </div>
    );
  },
};

export const Cyber: Story = {
  args: {
    items,
    targetKeys: [],
    onChange: () => {},
  },
  render: () => {
    const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
    return (
      <Transfer variant="cyber" items={items} targetKeys={targetKeys} onChange={setTargetKeys} />
    );
  },
};

export const Sizes: Story = {
  args: {
    items,
    targetKeys: [],
    onChange: () => {},
  },
  render: () => {
    const [targetKeys, setTargetKeys] = React.useState<string[]>([]);
    return (
      <div className="flex flex-col gap-6">
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <div key={s}>
            <p className="mb-2 text-xs text-muted-foreground">{s}</p>
            <Transfer size={s} items={items} targetKeys={targetKeys} onChange={setTargetKeys} />
          </div>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    items,
    targetKeys: ['1', '2'],
    onChange: () => {},
    disabled: true,
  },
  render: () => <Transfer items={items} targetKeys={['1', '2']} onChange={() => {}} disabled />,
};
