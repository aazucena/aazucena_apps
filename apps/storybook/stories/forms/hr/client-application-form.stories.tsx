import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ClientApplicationForm } from '@aazucena/forms/templates';

const meta = {
  title: 'Forms/HR/ClientApplicationForm',
  component: ClientApplicationForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Reverse job application: clients/employers apply to work with Aldrin. Two-step wizard.',
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
} satisfies Meta<typeof ClientApplicationForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
