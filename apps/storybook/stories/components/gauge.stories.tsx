import type { Meta, StoryObj } from '@storybook/react';
import { Gauge } from '@aazucena/ui';

const meta: Meta<typeof Gauge> = {
  title: 'Components/Data/Gauge',
  component: Gauge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The current value of the gauge.',
      table: {
        category: 'State',
        type: { summary: 'number' },
      },
    },
    min: {
      control: 'number',
      description: 'The minimum value of the gauge.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    max: {
      control: 'number',
      description: 'The maximum value of the gauge.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    label: {
      control: 'text',
      description: 'Optional label to display below the value.',
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
        defaultValue: { summary: '%' },
      },
    },
    strokeWidth: {
      control: { type: 'range', min: 5, max: 20, step: 1 },
      description: 'Thickness of the gauge stroke.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
        defaultValue: { summary: '10' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'success', 'warning', 'destructive'],
      description: 'Visual variant of the gauge.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'success' | 'warning' | 'destructive'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Overall size of the gauge.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg' | 'xl'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Gauge>;

export const Default: Story = {
  args: {
    value: 65,
    label: 'Progress',
  },
};

export const CustomRange: Story = {
  args: {
    value: 750,
    min: 0,
    max: 1000,
    label: 'Data Used',
    unit: 'GB',
  },
};

export const CyberVariant: Story = {
  args: {
    value: 88,
    label: 'UPLINK_STABILITY',
    unit: '%',
    variant: 'cyber',
    size: 'lg',
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
    label: 'Atmospheric Index',
    unit: '',
    variant: 'glass',
    size: 'xl',
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
    <div className="flex flex-col gap-8">
      <Gauge value={95} label="Risk Level" unit="" variant="destructive" size="default" />
      <Gauge value={70} label="Latency" unit="ms" variant="warning" size="default" />
      <Gauge value={30} label="System Load" unit="%" variant="success" size="default" />
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <Gauge value={50} label="Tiny" size="sm" strokeWidth={5} />
      <Gauge value={75} label="Normal" size="default" strokeWidth={10} />
      <Gauge value={25} label="Large" size="lg" strokeWidth={15} />
      <Gauge value={90} label="XL" size="xl" strokeWidth={20} />
    </div>
  ),
};

export const CustomStrokeWidth: Story = {
  args: {
    value: 70,
    label: 'Bandwidth',
    unit: 'Mbps',
    strokeWidth: 15,
    size: 'lg',
  },
};
