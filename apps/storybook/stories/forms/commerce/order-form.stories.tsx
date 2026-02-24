import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { OrderForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Commerce/OrderForm',
  component: OrderForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof OrderForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithDefaultValues: Story = {
  args: { variant: 'default', defaultValues: { shippingName: 'Aldrin Azucena', shippingCity: 'San Francisco', shippingCountry: 'US', billingEmail: 'aldrin@example.com' } },
};
