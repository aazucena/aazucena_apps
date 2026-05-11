import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timepicker } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Time selection component with separate hour, minute, and AM/PM selects.
 * - **UX:** Supports 12-hour and 24-hour formats with configurable minute step intervals.
 * - **Accessibility:** Each select has an aria-label (Hour, Minute, Period) for screen readers.
 * - **Design:** Composable with Datepicker for complete datetime selection workflows.
 */
const meta = {
  title: 'Components/Forms/Timepicker',
  component: Timepicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Time selection component with separate hour, minute, and period selects. Supports 12 and 24-hour formats with customizable minute step intervals.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Select size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    use24Hour: {
      control: 'boolean',
      description: 'Use 24-hour format instead of 12-hour AM/PM',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    minuteStep: {
      control: { type: 'number', min: 1, max: 30 },
      description: 'Minute increment step value',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all select elements',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      description: 'Controlled time value object',
      table: {
        category: 'Data',
        type: { summary: "{ hour: number; minute: number; period: 'AM' | 'PM' }" },
      },
    },
    onChange: {
      description: 'Callback fired when the time changes',
      table: {
        category: 'Behavior',
        type: { summary: '(time: { hour; minute; period }) => void' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Default 12-hour timepicker with a pre-set morning value.
 */
export const Basic: Story = {
  args: {
    value: { hour: 9, minute: 30, period: 'AM' },
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with frosted select styling on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="w-96 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with mono font and cyan accents in 24-hour mode.
 */
export const Cyber: Story = {
  args: {
    value: { hour: 23, minute: 59, period: 'PM' },
    variant: 'cyber',
    use24Hour: true,
  },
};

// --- SIZE VARIANTS ---

/**
 * All three size presets rendered side-by-side for comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-8 text-[10px] font-bold uppercase tracking-widest opacity-40">
            {size}
          </span>
          <Timepicker size={size} value={{ hour: 9, minute: 30, period: 'AM' }} />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * 24-hour format hides the AM/PM selector, showing hours 0-23.
 */
export const TwentyFourHour: Story = {
  args: {
    value: { hour: 14, minute: 0, period: 'PM' },
    use24Hour: true,
  },
};

/**
 * Minute step of 15 restricts choices to quarter-hour intervals.
 */
export const FifteenMinuteSteps: Story = {
  args: {
    value: { hour: 3, minute: 45, period: 'PM' },
    minuteStep: 15,
  },
};

/**
 * Disabled state dims the selects and prevents interaction.
 */
export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
  },
};
