import type { Meta, StoryObj } from '@storybook/react-vite';
import { Datepicker } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Date selection component using native browser `showPicker()` API with formatted display.
 * - **UX:** Formatted "MMM DD, YYYY" display with calendar icon trigger; graceful fallback for older browsers.
 * - **Design:** Three visual variants (default, glass, cyber) and three size presets (sm, md, lg).
 * - **Accessibility:** Hidden native `<input type="date">` provides keyboard and assistive technology support.
 */
const meta = {
  title: 'Components/Forms/Datepicker',
  component: Datepicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Date picker component with formatted display and native calendar popup via the showPicker() API. Supports default, glass, and cyber variants with three size presets.',
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
      description: 'Input size preset',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date is selected',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Pick a date' },
      },
    },
    value: {
      control: 'date',
      description: 'Currently selected date value',
      table: {
        category: 'Content',
        type: { summary: 'Date' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the date picker',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    min: {
      control: 'text',
      description: 'Minimum selectable date (ISO format)',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    max: {
      control: 'text',
      description: 'Maximum selectable date (ISO format)',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: { category: 'Styling' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Datepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard date picker with placeholder text and no pre-selected value.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    size: 'md',
    placeholder: 'Pick a date',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glassmorphic variant with frosted border, suitable for immersive overlays.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    placeholder: 'Select date',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Datepicker {...args} />
    </div>
  ),
};

/**
 * Cyber variant with monospaced text and neon focus glow for terminal UIs.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    placeholder: 'SELECT_DATE',
  },
};

/**
 * Pre-populated date picker showing a formatted date value.
 */
export const WithValue: Story = {
  args: {
    ...Basic.args,
    value: new Date('2026-03-15'),
  },
};

// --- SIZE VARIANTS ---

/**
 * All three size presets displayed vertically for comparison.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Datepicker size="sm" placeholder="Small" />
      <Datepicker size="md" placeholder="Medium" />
      <Datepicker size="lg" placeholder="Large" />
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Disabled state with reduced opacity and blocked pointer events.
 */
export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true,
    placeholder: 'Unavailable',
  },
};

/**
 * Date picker with min/max range constraints limiting selectable dates.
 */
export const WithRange: Story = {
  args: {
    ...Basic.args,
    min: '2026-01-01',
    max: '2026-12-31',
    placeholder: 'Within 2026',
  },
};
