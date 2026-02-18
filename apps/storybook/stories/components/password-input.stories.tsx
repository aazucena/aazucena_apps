import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput, type PasswordStrengthRule } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Augmented input that adds show/hide toggle and optional strength validation.
 * - **UX:** Eye icon toggles visibility; strength rules render a live Validator checklist below.
 * - **Design:** Inherits all Input variants (default/glass/cyber). Strength rules compose the Validator component.
 * - **Accessibility:** Toggle button has aria-label; Validator provides visual feedback per rule.
 */
const meta = {
  title: 'Components/Forms/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Password input with show/hide toggle and optional strength validation. Pass `strengthRules` to render a live Validator checklist with progress bar below the input. Rules are customizable pure functions.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant (delegated to Input)',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
      table: { category: 'State' },
    },
    showStrengthProgress: {
      control: 'boolean',
      description: 'Show the colored progress bar above the rule checklist',
      table: { category: 'Strength', defaultValue: { summary: 'true' } },
    },
    strengthSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size for the strength rules',
      table: { category: 'Strength', defaultValue: { summary: 'sm' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[22rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC ---

export const Basic: Story = {
  args: { placeholder: 'Enter password...' },
};

// --- STRENGTH VALIDATION ---

const defaultRules: PasswordStrengthRule[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'Contains uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'Contains lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'Contains a number', test: (v) => /\d/.test(v) },
  { label: 'Contains special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

/**
 * Demonstrates real-time password strength validation with the built-in Validator component.
 * Type in the field to see rules update live with a progress bar.
 */
export const WithStrength: Story = {
  args: {
    placeholder: 'Create a strong password...',
    strengthRules: defaultRules,
    showStrengthProgress: true,
  },
};

/**
 * Strength rules without the progress bar — just the checklist.
 */
export const StrengthNoProgress: Story = {
  args: {
    placeholder: 'Type to check rules...',
    strengthRules: defaultRules,
    showStrengthProgress: false,
  },
};

/**
 * Custom rules — you can define any validation logic.
 */
export const CustomRules: Story = {
  args: {
    placeholder: 'Custom rules demo...',
    strengthRules: [
      { label: 'At least 12 characters', test: (v: string) => v.length >= 12 },
      { label: 'No spaces allowed', test: (v: string) => !/\s/.test(v) },
      { label: 'Must start with a letter', test: (v: string) => /^[A-Za-z]/.test(v) },
    ],
    showStrengthProgress: true,
  },
};

// --- VARIANTS ---

export const Glass: Story = {
  args: {
    variant: 'glass',
    placeholder: 'Enter password...',
    strengthRules: defaultRules,
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <PasswordInput {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: {
    variant: 'cyber',
    placeholder: 'SECURE_KEY_INPUT',
    strengthRules: defaultRules,
  },
};

export const Disabled: Story = {
  args: { placeholder: 'Cannot edit...', disabled: true },
};
