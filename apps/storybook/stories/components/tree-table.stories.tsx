import type { Meta, StoryObj } from '@storybook/react';
import { TreeTable } from '@aazucena/ui';

const fileSystemData = [
  {
    key: 'src',
    data: { name: 'src', size: '—', modified: '2026-02-15' },
    children: [
      {
        key: 'components',
        data: { name: 'components', size: '—', modified: '2026-02-15' },
        children: [
          { key: 'button', data: { name: 'Button.tsx', size: '2.1 KB', modified: '2026-02-14' } },
          { key: 'modal', data: { name: 'Modal.tsx', size: '3.8 KB', modified: '2026-02-13' } },
          { key: 'card', data: { name: 'Card.tsx', size: '1.5 KB', modified: '2026-02-12' } },
        ],
      },
      {
        key: 'utils',
        data: { name: 'utils', size: '—', modified: '2026-02-14' },
        children: [
          { key: 'helpers', data: { name: 'helpers.ts', size: '1.2 KB', modified: '2026-02-10' } },
          { key: 'cn', data: { name: 'cn.ts', size: '0.3 KB', modified: '2026-02-08' } },
        ],
      },
      {
        key: 'hooks',
        data: { name: 'hooks', size: '—', modified: '2026-02-13' },
        children: [
          {
            key: 'useTheme',
            data: { name: 'useTheme.ts', size: '0.8 KB', modified: '2026-02-11' },
          },
        ],
      },
    ],
  },
  { key: 'package', data: { name: 'package.json', size: '1.4 KB', modified: '2026-02-15' } },
  { key: 'readme', data: { name: 'README.md', size: '2.6 KB', modified: '2026-02-10' } },
  { key: 'tsconfig', data: { name: 'tsconfig.json', size: '0.5 KB', modified: '2026-02-08' } },
];

const columns = [
  { key: 'name', header: 'Name', width: '50%' },
  { key: 'size', header: 'Size', width: '25%' },
  { key: 'modified', header: 'Modified', width: '25%' },
];

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) |
 * | UX | Table with expand/collapse toggle on first column for nested rows |
 * | Design | Composes Table styling patterns, indented child rows |
 */
const meta = {
  title: 'Components/Display/TreeTable',
  component: TreeTable,
  parameters: {
    docs: {
      description: {
        component:
          'A table where the first column has expand/collapse toggles for nested rows. Child rows are indented. Reuses existing Table styling patterns for visual consistency.',
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
      <div className="w-full p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { data: fileSystemData, columns },
};

export const CustomRender: Story = {
  args: {
    data: fileSystemData,
    columns: [
      {
        key: 'name',
        header: 'Name',
        width: '50%',
        render: (value: unknown) => <span className="font-medium">{String(value)}</span>,
      },
      {
        key: 'size',
        header: 'Size',
        width: '25%',
        render: (value: unknown) =>
          String(value) === '—' ? (
            <span className="text-muted-foreground italic">folder</span>
          ) : (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
              {String(value)}
            </span>
          ),
      },
      { key: 'modified', header: 'Modified', width: '25%' },
    ],
  },
};

export const Glass: Story = {
  args: { data: fileSystemData, columns, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <TreeTable {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { data: fileSystemData, columns, variant: 'cyber' },
};

export const Nested: Story = {
  args: { data: fileSystemData, columns },
};

export const Expanded: Story = {
  args: {
    data: fileSystemData,
    columns,
    defaultExpanded: ['src', 'components', 'utils'],
  },
};
