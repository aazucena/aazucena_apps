import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { BiometricAuthForm } from '@aazucena/forms/templates';

/**
 * ## BiometricAuthForm
 * WebAuthn / device biometric consent and setup form — user grants consent,
 * picks a preferred method (Face ID / Fingerprint / Either), and selects a
 * fallback if biometric is unavailable. Uses inline Zod schemas for field
 * validators because `biometricAuthSchema` uses `.refine()` (ZodEffects).
 */
const meta = {
  title: 'Forms/Auth/BiometricAuthForm',
  component: BiometricAuthForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed biometric auth consent form using `biometricAuthSchema`. The consent checkbox is required (`.refine()`) — submission is blocked until granted.',
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
} satisfies Meta<typeof BiometricAuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const FaceIDPreset: Story = {
  args: {
    variant: 'default',
    defaultValues: { preferredMethod: 'faceId', fallbackMethod: 'pin' },
  },
};

export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 backdrop-blur">
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
