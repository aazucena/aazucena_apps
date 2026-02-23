import type { Meta, StoryObj } from '@storybook/react';
import { Meter } from '@aazucena/ui';

const meta: Meta<typeof Meter> = {
  title: 'Components/Data/Meter',
  component: Meter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'The current value of the meter.',
      table: {
        category: 'State',
        type: { summary: 'number' },
      },
    },
    min: {
      control: 'number',
      description: 'The minimum value of the meter.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    max: {
      control: 'number',
      description: 'The maximum value of the meter.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    label: {
      control: 'text',
      description: 'Optional label to display above the meter.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    unit: {
      control: 'text',
      description: 'Optional unit to display next to the value.',
      table: {
        category: 'State',
        type: { summary: 'string' },
      },
    },
    showValue: {
      control: 'boolean',
      description: 'If true, displays the current value next to the label.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'success', 'warning', 'destructive'],
      description: 'Visual variant of the meter.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'success' | 'warning' | 'destructive'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the meter bar.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  args: {
    value: 65,
    label: 'Progress',
    showValue: true,
    unit: '%',
  },
};

export const CustomRange: Story = {
  args: {
    value: 750,
    min: 0,
    max: 1000,
    label: 'Data Usage',
    showValue: true,
    unit: 'MB',
  },
};

export const CyberVariant: Story = {
  args: {
    value: 88,
    label: 'CPU Load',
    showValue: true,
    unit: '%',
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
    value: 42,
    label: 'Atmospheric Stability',
    showValue: true,
    unit: '%',
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

export const SemanticColors: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Meter value={95} label="Disk Space" showValue unit="%" variant="destructive" />
      <Meter value={70} label="Network Latency" showValue unit="ms" variant="warning" />
      <Meter value={30} label="System Health" showValue unit="%" variant="success" />
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4 w-64">
      <Meter value={50} label="Small" size="sm" showValue unit="%" />
      <Meter value={75} label="Default" size="default" showValue unit="%" />
      <Meter value={25} label="Large" size="lg" showValue unit="%" />
    </div>
  ),
};

export const NoLabelOrValue: Story = {
  args: {
    value: 50,
    showValue: false,
    label: '',
  },
};
