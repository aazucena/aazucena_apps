import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ReactWheelPicker, ReactWheelPickerGroup } from '@aazucena/ui';

const meta: Meta<typeof ReactWheelPicker> = {
  title: 'Components/Forms/ReactWheelPicker',
  component: ReactWheelPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
      description: 'An array of string options to display in the wheel picker.',
      table: { category: 'Content', type: { summary: 'string[]' } },
    },
    value: {
      control: 'text',
      description: 'The currently selected value.',
      table: { category: 'State', type: { summary: 'string' } },
    },
    onChange: {
      action: 'valueChanged',
      description: 'Callback function when the selected value changes.',
      table: { category: 'Behavior', type: { summary: '(value: string) => void' } },
    },
    itemHeight: {
      control: { type: 'number', min: 20, max: 60, step: 2 },
      description: 'Height of each individual option item in pixels.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
        defaultValue: { summary: '40' },
      },
    },
    visibleCount: {
      control: { type: 'number', min: 1, max: 5, step: 1 },
      description: 'Number of items to show above and below the center.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
    loop: {
      control: 'boolean',
      description: 'Enable infinite looping of items.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the wheel picker.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the wheel picker container.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ReactWheelPicker>;

const numbers = Array.from({ length: 30 }, (_, i) => String(i + 1));
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const Default: Story = {
  args: {
    options: numbers,
    value: '10',
    loop: true,
  },
};

/**
 * Demonstrates multiple wheel pickers grouped together for a time selection UI.
 */
export const TimePickerGroup: Story = {
  render: (args) => {
    const [hour, setHour] = React.useState('12');
    const [minute, setMinute] = React.useState('30');
    const [meridiem, setMeridiem] = React.useState('PM');

    return (
      <div className="flex flex-col items-center gap-6">
        <ReactWheelPickerGroup>
          <ReactWheelPicker
            {...args}
            options={hours.slice(1, 13)}
            value={hour}
            onChange={setHour}
            size="md"
          />
          <span className="text-2xl font-black opacity-40 px-1">:</span>
          <ReactWheelPicker
            {...args}
            options={minutes}
            value={minute}
            onChange={setMinute}
            size="md"
          />
          <div className="w-4" />
          <ReactWheelPicker
            {...args}
            options={['AM', 'PM']}
            value={meridiem}
            onChange={setMeridiem}
            size="sm"
            loop={false}
          />
        </ReactWheelPickerGroup>

        <div className="text-center font-mono text-sm border p-2 rounded-lg bg-muted/20">
          SELECTED_TIME:{' '}
          <span className="text-primary font-bold">
            {hour}:{minute} {meridiem}
          </span>
        </div>
      </div>
    );
  },
  args: {
    variant: 'default',
  },
};

/**
 * Demonstrates the Cyber variant with high-fidelity highlighting.
 */
export const CyberDate: Story = {
  render: (args) => {
    return (
      <div className="bg-black p-12 rounded-[2rem] border border-cyan-500/20">
        <ReactWheelPickerGroup className="bg-cyan-500/5 border-cyan-500/20">
          <ReactWheelPicker
            {...args}
            options={['2024', '2025', '2026', '2027']}
            value="2026"
            variant="cyber"
          />
          <ReactWheelPicker
            {...args}
            options={['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']}
            value="FEB"
            variant="cyber"
          />
          <ReactWheelPicker
            {...args}
            options={Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))}
            value="22"
            variant="cyber"
          />
        </ReactWheelPickerGroup>
      </div>
    );
  },
};

export const GlassVariant: Story = {
  args: {
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Exosphere'],
    value: 'Mesosphere',
    variant: 'glass',
    size: 'lg',
    loop: false,
  },
  decorators: [
    (Story) => (
      <div className="p-20 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem]">
        <Story />
      </div>
    ),
  ],
};
