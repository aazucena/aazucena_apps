import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { HardwareKeyForm } from '@aazucena/forms/templates';

/**
 * ## HardwareKeyForm
 * FIDO2 / WebAuthn security key registration form — nickname, authenticator
 * attachment preference, user verification policy, resident key requirement,
 * and attestation type. Covers the full WebAuthn PublicKeyCredentialCreationOptions
 * surface area that a typical UI needs to expose.
 */
const meta = {
  title: 'Forms/Auth/HardwareKeyForm',
  component: HardwareKeyForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed hardware key registration form using `hardwareKeySchema`. Covers WebAuthn creation options: attachment, user verification, resident key, and attestation.',
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
} satisfies Meta<typeof HardwareKeyForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const PasskeyPreset: Story = {
  name: 'Passkey (Resident Key)',
  args: {
    variant: 'default',
    defaultValues: {
      keyNickname: 'MacBook Touch ID',
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      requireResidentKey: true,
      attestationType: 'none',
    },
  },
};

export const ExternalKeyPreset: Story = {
  name: 'External Security Key',
  args: {
    variant: 'default',
    defaultValues: {
      keyNickname: 'YubiKey 5 NFC',
      authenticatorAttachment: 'cross-platform',
      userVerification: 'preferred',
      requireResidentKey: false,
      attestationType: 'direct',
    },
  },
};

export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-slate-500/20 to-zinc-500/20 p-8 backdrop-blur">
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
