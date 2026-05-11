import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AutoComplete } from '@aazucena/ui';

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'next', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'astro', label: 'Astro' },
];

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + size (sm / md / lg) |
 * | UX | Always-editable input that filters options as you type |
 * | Design | Distinct from Combobox — input is always editable, supports freeSolo mode |
 */
const meta = {
  title: 'Components/Forms/AutoComplete',
  component: AutoComplete,
  parameters: {
    docs: {
      description: {
        component:
          'A type-ahead autocomplete input that filters a list of options as the user types. Supports free-form text input (freeSolo), loading state, and all three visual variants.',
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
    freeSolo: {
      control: 'boolean',
      table: { category: 'Behavior', defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Behavior' },
    },
    placeholder: {
      control: 'text',
      table: { category: 'Content' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AutoComplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    options: frameworks,
  },
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <AutoComplete
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Search frameworks..."
      />
    );
  },
};

export const Loading: Story = {
  args: { options: [], loading: true, placeholder: 'Loading...' },
};

export const FreeSolo: Story = {
  args: {
    options: frameworks,
  },
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <AutoComplete
        options={frameworks}
        value={value}
        onChange={setValue}
        freeSolo
        placeholder="Type anything..."
      />
    );
  },
};

export const Glass: Story = {
  args: {
    options: frameworks,
  },
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <AutoComplete variant="glass" options={frameworks} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Cyber: Story = {
  args: {
    options: frameworks,
  },
  render: () => {
    const [value, setValue] = React.useState('');
    return <AutoComplete variant="cyber" options={frameworks} value={value} onChange={setValue} />;
  },
};

export const Sizes: Story = {
  args: {
    options: frameworks,
  },
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <AutoComplete key={s} size={s} options={frameworks} placeholder={s} />
      ))}
    </div>
  ),
};
