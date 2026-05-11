import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { OTPVerificationForm } from '@aazucena/forms/templates';

/**
 * ## OTPVerificationForm
 * One-time password challenge form — accepts a 6-digit code with a large
 * mono digit input, optional device trust, and configurable trust duration.
 */
const meta = {
  title: 'Forms/Auth/OTPVerificationForm',
  component: OTPVerificationForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed OTP form using `otpVerificationSchema`. Trust-duration controls are shown only when `rememberDevice` is toggled on.',
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
    method: {
      control: 'text',
      table: { category: 'Context' },
      description: 'Display label for where the OTP was sent',
    },
    onSuccess: { table: { category: 'Events' } },
    onError: { table: { category: 'Events' } },
  },
  args: {
    onSuccess: fn(),
    onError: fn(),
    method: 'your authenticator app',
  },
} satisfies Meta<typeof OTPVerificationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const ViaSMS: Story = {
  args: { variant: 'default', method: 'SMS to +1 (555) ••• ••47' },
};

export const ViaEmail: Story = {
  args: { variant: 'default', method: 'email to a••••n@example.com' },
};

export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 backdrop-blur">
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
