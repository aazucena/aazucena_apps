import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CertificateAuthForm } from '@aazucena/forms/templates';

/**
 * ## CertificateAuthForm
 * mTLS / client-certificate authentication form — PEM certificate textarea,
 * optional private key, passphrase, and session-remember toggle. Monospaced
 * textarea styling emphasizes the PEM format. Security notice reminds users
 * data is TLS-only and never stored.
 */
const meta = {
  title: 'Forms/Auth/CertificateAuthForm',
  component: CertificateAuthForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed certificate auth form using `certificateAuthSchema`. PEM fields use monospaced styling. Private key and passphrase are optional.',
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
} satisfies Meta<typeof CertificateAuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-card p-8">
        <Story />
      </div>
    ),
  ],
};

export const Cyber: Story = {
  args: { variant: 'cyber' },
  decorators: [
    (Story) => (
      <div className="rounded-card border border-signal/20 bg-background p-8">
        <Story />
      </div>
    ),
  ],
};
