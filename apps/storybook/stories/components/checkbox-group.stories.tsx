import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CheckboxGroup, type CheckboxGroupOption } from '@aazucena/ui';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Components/Forms/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label for the entire checkbox group.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    options: {
      control: 'object',
      description: 'An array of options for the checkboxes.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    value: {
      control: 'object',
      description: 'An array of currently selected values (controlled).',
      table: {
        category: 'State',
        type: { summary: 'object' },
      },
    },
    onChange: {
      action: 'selectedValuesChanged',
      description: 'Callback function when selected values change.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    direction: {
      control: 'select',
      options: ['column', 'row'],
      description: 'Layout direction of the checkboxes.',
      table: {
        category: 'Appearance',
        type: { summary: "'column' | 'row'" },
        defaultValue: { summary: 'column' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, all checkboxes in the group are disabled.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the checkbox group.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

const sampleOptions: CheckboxGroupOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
];

export const Default: Story = {
  args: {
    label: 'Select Fruits',
    options: sampleOptions,
    value: ['apple'],
  },
  render: (args) => {
    const [selectedFruits, setSelectedFruits] = React.useState(args.value || []);
    return (
      <CheckboxGroup
        {...args}
        value={selectedFruits}
        onChange={(newValues) => {
          setSelectedFruits(newValues);
          args.onChange?.(newValues);
        }}
      />
    );
  },
};

export const HorizontalLayout: Story = {
  args: {
    label: 'Preferred Programming Languages',
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'python', label: 'Python' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
    ],
    direction: 'row',
    value: ['typescript', 'rust'],
  },
  render: (args) => {
    const [selectedLangs, setSelectedLangs] = React.useState(args.value || []);
    return (
      <CheckboxGroup
        {...args}
        value={selectedLangs}
        onChange={(newValues) => {
          setSelectedLangs(newValues);
          args.onChange?.(newValues);
        }}
      />
    );
  },
};

export const CyberVariant: Story = {
  args: {
    label: 'PROTOCOL_SELECTION',
    options: [
      { value: 'tcp', label: 'TCP' },
      { value: 'udp', label: 'UDP' },
      { value: 'http', label: 'HTTP' },
      { value: 'ssh', label: 'SSH', disabled: true },
    ],
    value: ['tcp'],
    variant: 'cyber',
    direction: 'row',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [selectedProtocols, setSelectedProtocols] = React.useState(args.value || []);
    return (
      <CheckboxGroup
        {...args}
        value={selectedProtocols}
        onChange={(newValues) => {
          setSelectedProtocols(newValues);
          args.onChange?.(newValues);
        }}
      />
    );
  },
};

export const GlassVariant: Story = {
  args: {
    label: 'Atmospheric Layers',
    options: [
      { value: 'troposphere', label: 'Troposphere' },
      { value: 'stratosphere', label: 'Stratosphere' },
      { value: 'mesosphere', label: 'Mesosphere' },
      { value: 'exosphere', label: 'Exosphere', disabled: true },
    ],
    value: ['troposphere', 'stratosphere'],
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
  render: (args) => {
    const [selectedLayers, setSelectedLayers] = React.useState(args.value || []);
    return (
      <CheckboxGroup
        {...args}
        value={selectedLayers}
        onChange={(newValues) => {
          setSelectedLayers(newValues);
          args.onChange?.(newValues);
        }}
      />
    );
  },
};

export const AllDisabled: Story = {
  args: {
    label: 'Unavailable Options',
    options: sampleOptions,
    value: ['banana'],
    disabled: true,
  },
  render: (args) => {
    const [selectedFruits, setSelectedFruits] = React.useState(args.value || []);
    return (
      <CheckboxGroup
        {...args}
        value={selectedFruits}
        onChange={(newValues) => {
          setSelectedFruits(newValues);
          args.onChange?.(newValues);
        }}
      />
    );
  },
};

export const WithSomeDisabledOptions: Story = {
  args: {
    label: 'Choose your toppings',
    options: [
      { value: 'cheese', label: 'Cheese' },
      { value: 'pepperoni', label: 'Pepperoni' },
      { value: 'mushrooms', label: 'Mushrooms', disabled: true },
      { value: 'olives', label: 'Olives' },
    ],
    value: ['cheese', 'olives'],
  },
  render: (args) => {
    const [selectedToppings, setSelectedToppings] = React.useState(args.value || []);
    return (
      <CheckboxGroup
        {...args}
        value={selectedToppings}
        onChange={(newValues) => {
          setSelectedToppings(newValues);
          args.onChange?.(newValues);
        }}
      />
    );
  },
};
