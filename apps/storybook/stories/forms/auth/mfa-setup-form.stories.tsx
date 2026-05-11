import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MFASetupForm } from '@aazucena/forms/templates';

/**
 * ## MFASetupForm
 * Multi-factor authentication setup wizard — Step 1 selects the MFA method
 * (authenticator app, SMS, email, or hardware key) and captures a contact detail
 * for SMS/email methods. Step 2 verifies the setup with a 6-digit code.
 * Includes the Easter-egg challenge step via `showChallenge`.
 */
const meta = {
  title: 'Forms/Auth/MFASetupForm',
  component: MFASetupForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Multi-step MFA setup form using `mfaSetupSchema` + `FormWizard`. Method selection on step 1 conditionally shows a contact detail field for SMS/email.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance' },
    },
    onSuccess: { table: { category: 'Events' } },
    onError: { table: { category: 'Events' } },
  },
  args: {
    onSuccess: fn(),
    onError: fn(),
  },
} satisfies Meta<typeof MFASetupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 p-8 backdrop-blur">
        <Story />
      </div>
    ),
  ],
};

export const Cyber: Story = {
  args: { variant: 'cyber' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl border border-cyan-500/20 bg-black p-8">
        <Story />
      </div>
    ),
  ],
};
