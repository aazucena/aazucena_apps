import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { DonationForm } from '@aazucena/forms/templates';

const meta = {
  title: 'Forms/Commerce/DonationForm',
  component: DonationForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof DonationForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const CustomPresets: Story = { args: { variant: 'default', presets: [1, 3, 7, 15, 30] } };
