import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { IncidentPostMortemForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Platform/IncidentPostMortemForm',
  component: IncidentPostMortemForm,
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
} satisfies Meta<typeof IncidentPostMortemForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const Sev1: Story = {
  args: {
    variant: 'default',
    defaultValues: { severity: 'sev1', title: 'Complete outage — all services down' },
  },
};
