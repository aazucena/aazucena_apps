import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { StatusSubscriptionForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Support/StatusSubscriptionForm',
  component: StatusSubscriptionForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof StatusSubscriptionForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithDefaultValues: Story = {
  args: { variant: 'default', defaultValues: { email: 'user@example.com', notifyOn: ['incident', 'resolved'], deliveryMethod: 'email' } },
};
