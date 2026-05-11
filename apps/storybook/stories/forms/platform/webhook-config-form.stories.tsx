import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { WebhookConfigForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Platform/WebhookConfigForm',
  component: WebhookConfigForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: { category: 'Appearance' },
    },
  },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof WebhookConfigForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithDefaultValues: Story = {
  args: {
    variant: 'default',
    defaultValues: {
      url: 'https://example.com/webhook',
      events: ['deploy'],
      retryPolicy: '3x',
      format: 'json',
      sslVerify: true,
    },
  },
};
