import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepForm } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Multi-step form wizard with step indicators, content switching, and navigation.
 * - **UX:** Prev/Next/Submit flow with optional per-step validation gating the Next button.
 * - **Design:** Step indicators show completed (check), active (highlighted), and upcoming states.
 * - **Accessibility:** Navigation buttons clearly labeled; step indicator numbers readable.
 */
const meta = {
  title: 'Components/Forms/StepForm',
  component: StepForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Multi-step form wizard with horizontal step indicators, content panels, and navigation controls. Supports per-step validation, custom labels, and three visual variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    submitLabel: {
      control: 'text',
      description: 'Label for the submit button',
      table: { category: 'Content', defaultValue: { summary: 'Submit' } },
    },
    nextLabel: {
      control: 'text',
      description: 'Label for the next button',
      table: { category: 'Content', defaultValue: { summary: 'Next' } },
    },
    prevLabel: {
      control: 'text',
      description: 'Label for the back button',
      table: { category: 'Content', defaultValue: { summary: 'Back' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[32rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicSteps = [
  { label: 'Account', content: <div className="space-y-2"><p className="text-sm">Enter your account details.</p><input className="w-full rounded border px-3 py-2 text-sm" placeholder="Email" /></div> },
  { label: 'Profile', content: <div className="space-y-2"><p className="text-sm">Tell us about yourself.</p><input className="w-full rounded border px-3 py-2 text-sm" placeholder="Display name" /></div> },
  { label: 'Review', content: <p className="text-sm text-muted-foreground">Review your information and submit.</p> },
];

export const Basic: Story = {
  args: {
    steps: basicSteps,
    onSubmit: () => alert('Submitted!'),
  },
};

export const WithValidation: Story = {
  args: {
    steps: [
      { label: 'Step 1', content: <p className="text-sm">This step always passes validation.</p>, isValid: () => true },
      { label: 'Step 2', content: <p className="text-sm text-destructive">This step always fails validation — Next is disabled.</p>, isValid: () => false },
      { label: 'Step 3', content: <p className="text-sm">You should not reach here.</p> },
    ],
    onSubmit: () => alert('Submitted!'),
  },
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <StepForm {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { ...Basic.args, variant: 'cyber' },
};

export const CustomLabels: Story = {
  args: {
    ...Basic.args,
    nextLabel: 'Continue',
    prevLabel: 'Go Back',
    submitLabel: 'Confirm',
  },
};
