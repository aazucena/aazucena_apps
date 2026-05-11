import type { Meta, StoryObj } from '@storybook/react-vite';
import { Validator } from '@aazucena/ui';
import type { ValidatorRule } from '@aazucena/ui';

const mixedRules: ValidatorRule[] = [
  { label: 'At least 8 characters', valid: true },
  { label: 'Contains uppercase letter', valid: true },
  { label: 'Contains a number', valid: false },
  { label: 'Contains special character', valid: false },
];

const allValidRules: ValidatorRule[] = [
  { label: 'At least 8 characters', valid: true },
  { label: 'Contains uppercase letter', valid: true },
  { label: 'Contains a number', valid: true },
  { label: 'Contains special character', valid: true },
];

const allInvalidRules: ValidatorRule[] = [
  { label: 'At least 8 characters', valid: false },
  { label: 'Contains uppercase letter', valid: false },
  { label: 'Contains a number', valid: false },
  { label: 'Contains special character', valid: false },
];

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Form validation feedback primitive that renders rule-by-rule pass/fail indicators.
 * - **UX:** Provides real-time visual feedback with optional progress bar summarizing overall validity percentage.
 * - **Accessibility:** Each rule is rendered as a list item with clear iconographic pass/fail state and color coding.
 */
const meta = {
  title: 'Components/Forms/Validator',
  component: Validator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A validation checklist that displays the pass/fail state of multiple rules with an optional progress bar. Ideal for password strength indicators and form field validation feedback.',
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
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size of the rule labels',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    showProgress: {
      control: 'boolean',
      description: 'Show a progress bar summarizing the percentage of rules passing',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    rules: {
      control: 'object',
      description: 'Array of validation rules with label and valid status',
      table: {
        category: 'Content',
        type: { summary: 'ValidatorRule[]' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Validator>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard validation checklist with a mix of passing and failing rules.
 */
export const Basic: Story = {
  args: {
    rules: mixedRules,
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a vivid gradient background for frosted-glass UI contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    showProgress: true,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <div className="w-[320px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon-accented progress bar and rule indicators.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    showProgress: true,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <div className="w-[320px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

// --- SIZE VARIANTS ---

/**
 * Comparison of all three size presets rendered vertically.
 */
export const Sizes: Story = {
  args: {
    rules: mixedRules,
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest opacity-40">
            {size}
          </span>
          <Validator rules={mixedRules} size={size} showProgress />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * All rules passing with a green progress bar at 100% completion.
 */
export const AllValid: Story = {
  args: {
    rules: allValidRules,
    showProgress: true,
  },
};

/**
 * All rules failing with a red progress bar at 0% to show the empty state.
 */
export const AllInvalid: Story = {
  args: {
    rules: allInvalidRules,
    showProgress: true,
  },
};

/**
 * Progress bar enabled with mixed validation state showing a yellow 50% bar.
 */
export const WithProgress: Story = {
  args: {
    ...Basic.args,
    showProgress: true,
  },
};
