import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + size (sm / md / lg) |
 * | UX | Popover trigger with dual-month range calendar |
 * | Design | Composes RangeCalendar — auto-closes when both dates selected |
 */
const meta = {
  title: 'Components/Forms/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component:
          'A date range picker that composes RangeCalendar inside a popover. Shows formatted date range in the trigger button. Auto-closes when both start and end dates are selected.',
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
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3 },
      table: { category: 'Appearance', defaultValue: { summary: '2' } },
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
      <div className="w-80 min-h-[400px] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return <DateRangePicker value={range} onChange={setRange} />;
  },
};

export const SingleMonth: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return <DateRangePicker value={range} onChange={setRange} numberOfMonths={1} />;
  },
};

export const Glass: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <DateRangePicker variant="glass" value={range} onChange={setRange} />
      </div>
    );
  },
};

export const Cyber: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return <DateRangePicker variant="cyber" value={range} onChange={setRange} />;
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <DateRangePicker key={s} size={s} placeholder={`Size: ${s}`} />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled' },
};
