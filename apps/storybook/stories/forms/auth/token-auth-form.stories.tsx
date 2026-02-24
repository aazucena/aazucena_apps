import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { TokenAuthForm } from '@aazucena/forms/templates';

/**
 * ## TokenAuthForm
 * API key / JWT / OAuth token authentication form — token type selector,
 * masked token input with show/hide toggle, optional label and expiry date.
 */
const meta = {
  title: 'Forms/Auth/TokenAuthForm',
  component: TokenAuthForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pre-composed token auth form using `tokenAuthSchema`. Token is masked by default with a show/hide emoji toggle. Supports Bearer, API Key, JWT, and OAuth token types.',
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
} satisfies Meta<typeof TokenAuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
};

export const APIKeyPreset: Story = {
  args: {
    variant: 'default',
    defaultValues: { tokenType: 'apiKey', label: 'Production API key' },
  },
};

export const JWTPreset: Story = {
  args: {
    variant: 'default',
    defaultValues: { tokenType: 'jwt', label: 'Service account JWT' },
  },
};

export const Glass: Story = {
  args: { variant: 'glass' },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-br from-teal-500/20 to-green-500/20 p-8 backdrop-blur">
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
