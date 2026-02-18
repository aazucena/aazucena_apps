import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConditionRules, type ConditionGroup, type ConditionField } from '@aazucena/ui';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Recursive AND/OR condition builder inspired by Directus's filter interface.
 * - **UX:** Nested groups with toggleable AND/OR logic, add rule/group, and remove buttons.
 * - **Design:** Split into 3 files (ConditionRules, ConditionRulesGroup, ConditionRulesNode) for maintainability.
 * - **Accessibility:** Select dropdowns and inputs for each condition row; delete buttons with aria-labels.
 */
const meta = {
  title: 'Components/Forms/ConditionRules',
  component: ConditionRules,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Recursive visual builder for nested AND/OR condition groups. Inspired by Directus filter interface. Supports configurable fields, operators, max nesting depth, and three visual variants.',
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
    maxDepth: {
      control: 'number',
      description: 'Maximum nesting depth for groups',
      table: { category: 'Behavior', defaultValue: { summary: '3' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[36rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConditionRules>;

export default meta;
type Story = StoryObj<typeof meta>;

const fields: ConditionField[] = [
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'email', label: 'Email', type: 'string' },
  { key: 'age', label: 'Age', type: 'number' },
  { key: 'active', label: 'Active', type: 'boolean' },
  { key: 'created_at', label: 'Created At', type: 'date' },
  { key: 'role', label: 'Role', type: 'select', options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ]},
];

const ConditionDemo = (props: Partial<React.ComponentProps<typeof ConditionRules>>) => {
  const [value, setValue] = useState<ConditionGroup>({
    logic: 'and',
    conditions: [{ field: 'name', operator: 'contains', value: '' }],
  });
  return <ConditionRules fields={fields} value={value} onChange={setValue} {...props} />;
};

export const Basic: Story = {
  render: () => <ConditionDemo />,
};

export const Nested: Story = {
  render: () => {
    const [value, setValue] = useState<ConditionGroup>({
      logic: 'and',
      conditions: [
        { field: 'role', operator: 'eq', value: 'admin' },
        {
          logic: 'or',
          conditions: [
            { field: 'age', operator: 'gte', value: 18 },
            { field: 'active', operator: 'eq', value: true },
          ],
        },
      ],
    });
    return <ConditionRules fields={fields} value={value} onChange={setValue} />;
  },
};

export const Glass: Story = {
  render: () => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <ConditionDemo variant="glass" />
    </div>
  ),
};

export const Cyber: Story = {
  render: () => <ConditionDemo variant="cyber" />,
};

export const CustomOperators: Story = {
  render: () => (
    <ConditionDemo
      operators={[
        { key: 'eq', label: '==' },
        { key: 'neq', label: '!=' },
        { key: 'regex', label: '~' },
      ]}
    />
  ),
};

export const MaxDepth: Story = {
  args: { maxDepth: 1 },
  render: (args) => <ConditionDemo {...args} />,
};
