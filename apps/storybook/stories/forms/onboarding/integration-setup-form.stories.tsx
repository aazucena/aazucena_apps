import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { IntegrationSetupForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Onboarding/IntegrationSetupForm',
  component: IntegrationSetupForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof IntegrationSetupForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithDefaultValues: Story = {
  args: { variant: 'default', defaultValues: { integration: 'GitHub', authMethod: 'oauth', syncDirection: 'one_way', syncFrequency: 'realtime' } },
};
