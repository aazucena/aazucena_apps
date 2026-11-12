import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SSOForm } from '@aazucena/forms/templates';

/**
 * ## SSOForm
 * Single Sign-On provider selection form — 7 providers in a grid.
 * Enterprise providers (SAML, OIDC, Okta) conditionally reveal a tenant domain
 * field. Work email field enables org-level SSO auto-detection.
 */
const meta = {
  title: 'Forms/Auth/SSOForm',
  component: SSOForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed SSO form using `ssoSchema`. Tenant domain field is conditionally shown for enterprise providers (SAML, OIDC, Okta).',
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
} satisfies Meta<typeof SSOForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const EnterprisePreset: Story = {
  args: { variant: 'default', defaultValues: { provider: 'saml', tenantDomain: 'auth.acme.com' } },
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
