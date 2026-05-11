import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { HireInquiryForm } from '@aazucena/forms/templates';

const meta = {
  title: 'Forms/HR/HireInquiryForm',
  component: HireInquiryForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Inbound role interest lead capture — full-time, contract, or freelance inquiries.',
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
} satisfies Meta<typeof HireInquiryForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
