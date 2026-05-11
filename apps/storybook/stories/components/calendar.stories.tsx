import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '@aazucena/ui';
import { useState } from 'react';
import { addDays } from 'date-fns';

/**
 * ## Engineering Standards
 * - **Pattern:** Date selection primitive built on `react-day-picker`.
 * - **Logic:** Supports `single`, `multiple`, and `range` selection modes.
 * - **Variants:** Aligned with site-wide themes (`glass`, `cyber`) for consistent technical depth.
 * - **Accessibility:** Fully keyboard navigable with standardized ARIA roles for day buttons and grid cells.
 */
const meta = {
  title: 'Components/Primitives/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A date picker component that allows users to select single days, multiple days, or ranges. Features theme-aware visual variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual style of the calendar container and navigation',
      table: { category: 'Appearance' },
    },
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'Selection mode',
      table: { category: 'Behavior' },
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Toggle visibility of days from adjacent months',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

// --- STORIES ---

/**
 * Standard calendar implementation for single date selection.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    mode: 'single',
  },
  render: (args) => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="rounded-xl border shadow-lg overflow-hidden">
        <Calendar {...args} mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

/**
 * High-performance cyber variant with neon accents and high-contrast borders.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
    mode: 'single',
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar {...args} mode="single" selected={date} onSelect={setDate} />;
  },
};

/**
 * Immersive glass variant, ideal for deployment modals or status overlays.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
    mode: 'single',
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="p-12 bg-gradient-to-br from-zinc-900 to-black rounded-[2rem]">
        <Calendar {...args} mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};

/**
 * Demonstrates the range selection mode for duration-based inputs.
 */
export const RangeSelection: Story = {
  args: {
    mode: 'range',
  },
  render: (args) => {
    const [range, setRange] = useState<any>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });

    return (
      <div className="rounded-xl border shadow-lg overflow-hidden">
        <Calendar {...args} mode="range" selected={range} onSelect={setRange} />
      </div>
    );
  },
};

/**
 * Features pagination through month navigation buttons.
 */
export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="rounded-xl border shadow-lg overflow-hidden">
        <Calendar {...args} mode="single" selected={date} onSelect={setDate} />
      </div>
    );
  },
};
