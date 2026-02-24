import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { AdaptiveAuthForm } from '@aazucena/forms/templates';

/**
 * ## AdaptiveAuthForm
 * Risk-based adaptive authentication challenge — shown when the system detects
 * unusual sign-in behaviour. Displays the computed risk level badge and appropriate
 * challenge prompt (CAPTCHA, security question, email/SMS PIN). Includes device-trust
 * toggle with configurable trust duration.
 */
const meta = {
  title: 'Forms/Auth/AdaptiveAuthForm',
  component: AdaptiveAuthForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed adaptive auth challenge form using `adaptiveAuthSchema`. `riskLevel` and `challengeType` are display-only context props — they do not affect validation.',
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
    riskLevel: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      table: { category: 'Context' },
    },
    challengeType: {
      control: 'select',
      options: ['captcha', 'security-question', 'email-pin', 'sms-pin'],
      table: { category: 'Context' },
    },
    onSuccess: { table: { category: 'Events' } },
    onError: { table: { category: 'Events' } },
  },
  args: {
    onSuccess: fn(),
    onError: fn(),
    riskLevel: 'medium',
    challengeType: 'email-pin',
  },
} satisfies Meta<typeof AdaptiveAuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const HighRisk: Story = {
  args: { variant: 'default', riskLevel: 'high', challengeType: 'security-question' },
};

export const LowRisk: Story = {
  args: { variant: 'default', riskLevel: 'low', challengeType: 'sms-pin' },
};

export const Glass: Story = {
  args: { variant: 'glass', riskLevel: 'medium' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 p-8 backdrop-blur">
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
