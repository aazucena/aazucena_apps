import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { DeploymentTriggerForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Platform/DeploymentTriggerForm',
  component: DeploymentTriggerForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof DeploymentTriggerForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const ProductionDeploy: Story = {
  args: {
    variant: 'default',
    defaultValues: { environment: 'production', service: 'portfolio-web', versionTag: 'v2.5.0' },
  },
};
