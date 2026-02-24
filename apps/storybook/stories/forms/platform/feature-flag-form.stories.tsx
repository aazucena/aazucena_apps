import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { FeatureFlagForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Platform/FeatureFlagForm',
  component: FeatureFlagForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof FeatureFlagForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithDefaultValues: Story = {
  args: { variant: 'default', defaultValues: { flagKey: 'new_dashboard', displayName: 'New Dashboard', environment: 'dev', enabled: false, rolloutPercentage: 0 } },
};
