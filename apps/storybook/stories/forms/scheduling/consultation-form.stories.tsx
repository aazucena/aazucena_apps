import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConsultationForm } from '@aazucena/forms/templates';

const meta = {
  title: 'Forms/Scheduling/ConsultationForm',
  component: ConsultationForm,
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
} satisfies Meta<typeof ConsultationForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
