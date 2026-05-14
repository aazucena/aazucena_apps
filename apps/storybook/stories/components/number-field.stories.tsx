import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberField } from '@aazucena/ui';
import React from 'react';

const meta: Meta<typeof NumberField> = {
  title: 'Components/Forms/NumberField',
  component: NumberField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'The current numeric value.',
      table: { category: 'State', type: { summary: 'number' } },
    },
    onChange: {
      action: 'valueChanged',
      description: 'Callback function when the value changes.',
      table: { category: 'Behavior', type: { summary: '() => void' } },
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value.',
      table: { category: 'State', type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value.',
      table: { category: 'State', type: { summary: 'number' }, defaultValue: { summary: '100' } },
    },
    step: {
      control: 'number',
      description: 'Increment/decrement step amount.',
      table: { category: 'State', type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    label: {
      control: 'text',
      description: 'Optional label for the number field.',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    unit: {
      control: 'text',
      description: 'Optional unit to display next to the value.',
      table: { category: 'State', type: { summary: 'string' } },
    },
    scrubArea: {
      control: 'boolean',
      description: 'Enable horizontal mouse drag (scrub) to change value.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the input and buttons are disabled.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the number field.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the number field.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  args: {
    label: 'Quantity',
    value: 5,
    min: 0,
    max: 10,
  },
};

export const WithUnitAndStep: Story = {
  args: {
    label: 'Temperature',
    value: 25,
    min: -20,
    max: 50,
    step: 0.5,
    unit: '°C',
    size: 'lg',
  },
};

export const CyberVariant: Story = {
  args: {
    label: 'NODE_FREQUENCY',
    value: 420,
    min: 100,
    max: 1000,
    step: 10,
    unit: 'MHz',
    variant: 'cyber',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    label: 'Refraction Index',
    value: 1.33,
    min: 1.0,
    max: 2.0,
    step: 0.01,
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const WithScrubArea: Story = {
  args: {
    label: 'Scrub Value',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    scrubArea: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Locked Setting',
    value: 75,
    disabled: true,
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <NumberField label="Small" value={10} size="sm" />
      <NumberField label="Default" value={20} size="default" />
      <NumberField label="Large" value={30} size="lg" />
    </div>
  ),
};
