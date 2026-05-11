import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CopyrightClaimForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Legal/CopyrightClaimForm',
  component: CopyrightClaimForm,
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
} satisfies Meta<typeof CopyrightClaimForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithDefaultValues: Story = {
  args: { variant: 'default', defaultValues: { goodFaithStatement: false } },
};
