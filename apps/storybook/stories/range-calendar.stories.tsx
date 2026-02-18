import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { DateRange } from 'react-day-picker';
import { RangeCalendar } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Delegates to Calendar with mode="range" — inherits Calendar variants |
 * | UX | Select start and end dates by clicking two days |
 * | Design | Thin wrapper that simplifies Calendar API for range selection |
 */
const meta = {
  title: 'Components/Forms/RangeCalendar',
  component: RangeCalendar,
  parameters: {
    docs: {
      description: {
        component:
          'A date range selection calendar that wraps Calendar with mode="range". Supports all Calendar variants and re-exports the DateRange type.',
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
    numberOfMonths: {
      control: { type: 'number', min: 1, max: 3 },
      table: { category: 'Appearance', defaultValue: { summary: '1' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return <RangeCalendar value={range} onChange={setRange} />;
  },
};

export const TwoMonths: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return <RangeCalendar value={range} onChange={setRange} numberOfMonths={2} />;
  },
};

export const Glass: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <RangeCalendar variant="glass" value={range} onChange={setRange} />
      </div>
    );
  },
};

export const Cyber: Story = {
  render: () => {
    const [range, setRange] = React.useState<DateRange | undefined>();
    return <RangeCalendar variant="cyber" value={range} onChange={setRange} />;
  },
};
