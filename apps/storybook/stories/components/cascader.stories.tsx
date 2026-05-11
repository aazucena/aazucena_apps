import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Cascader } from '@aazucena/ui';

const locationOptions = [
  {
    value: 'us',
    label: 'United States',
    children: [
      {
        value: 'ca',
        label: 'California',
        children: [
          { value: 'sf', label: 'San Francisco' },
          { value: 'la', label: 'Los Angeles' },
          { value: 'sd', label: 'San Diego' },
        ],
      },
      {
        value: 'ny',
        label: 'New York',
        children: [
          { value: 'nyc', label: 'New York City' },
          { value: 'buf', label: 'Buffalo' },
        ],
      },
    ],
  },
  {
    value: 'uk',
    label: 'United Kingdom',
    children: [
      {
        value: 'england',
        label: 'England',
        children: [
          { value: 'london', label: 'London' },
          { value: 'manchester', label: 'Manchester' },
        ],
      },
    ],
  },
  {
    value: 'ca',
    label: 'Canada',
    children: [
      {
        value: 'on',
        label: 'Ontario',
        children: [
          { value: 'toronto', label: 'Toronto' },
          { value: 'ottawa', label: 'Ottawa' },
        ],
      },
    ],
  },
];

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + size (sm / md / lg) |
 * | UX | Cascading column panels for hierarchical selection |
 * | Design | Breadcrumb-style display, supports click or hover expansion |
 */
const meta = {
  title: 'Components/Forms/Cascader',
  component: Cascader,
  parameters: {
    docs: {
      description: {
        component:
          'A cascading selection component for hierarchical data. Opens multi-column panels where each column shows children of the selected parent. Displays selected path in breadcrumb format.',
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
    expandTrigger: {
      control: 'select',
      options: ['click', 'hover'],
      table: { category: 'Behavior', defaultValue: { summary: 'click' } },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Behavior' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 min-h-[300px] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Cascader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    options: locationOptions,
  },
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <Cascader
        options={locationOptions}
        value={value}
        onChange={(v) => setValue(v)}
        placeholder="Select location..."
      />
    );
  },
};

export const HoverExpand: Story = {
  args: {
    options: locationOptions,
  },
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <Cascader
        options={locationOptions}
        value={value}
        onChange={(v) => setValue(v)}
        expandTrigger="hover"
      />
    );
  },
};

export const Glass: Story = {
  args: {
    options: locationOptions,
  },
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Cascader
          variant="glass"
          options={locationOptions}
          value={value}
          onChange={(v) => setValue(v)}
        />
      </div>
    );
  },
};

export const Cyber: Story = {
  args: {
    options: locationOptions,
  },
  render: () => {
    const [value, setValue] = React.useState<string[]>([]);
    return (
      <Cascader
        variant="cyber"
        options={locationOptions}
        value={value}
        onChange={(v) => setValue(v)}
      />
    );
  },
};

export const Sizes: Story = {
  args: {
    options: locationOptions,
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Cascader key={s} size={s} options={locationOptions} placeholder={s} />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    options: locationOptions,
    disabled: true,
    placeholder: 'Disabled',
  },
};
