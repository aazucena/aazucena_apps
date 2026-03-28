import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AlertConfigForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Analytics/AlertConfigForm',
  component: AlertConfigForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Create monitoring alerts: metric, threshold, operator, and notification channel.',
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
  },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof AlertConfigForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithCustomMetrics: Story = {
  args: { variant: 'default', availableMetrics: ['http_errors', 'db_latency', 'queue_depth'] },
};
