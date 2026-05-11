import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AvailabilitySetupForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Scheduling/AvailabilitySetupForm',
  component: AvailabilitySetupForm,
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
} satisfies Meta<typeof AvailabilitySetupForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithDefaultValues: Story = {
  args: {
    variant: 'default',
    defaultValues: {
      timezone: 'America/New_York',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '09:00',
      endTime: '17:00',
      bufferBetween: '15',
      advanceNotice: 24,
      maxPerDay: 5,
    },
  },
};
