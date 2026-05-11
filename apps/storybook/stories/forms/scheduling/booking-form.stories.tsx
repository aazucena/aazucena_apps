import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { BookingForm } from '@aazucena/forms/templates';

const meta = {
  title: 'Forms/Scheduling/BookingForm',
  component: BookingForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Two-step booking wizard: select service + time slot, then provide contact details.',
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
} satisfies Meta<typeof BookingForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const CustomServices: Story = {
  args: {
    variant: 'default',
    serviceTypes: ['Portfolio Review', 'System Design', 'Career Coaching', 'Music Collab'],
  },
};
