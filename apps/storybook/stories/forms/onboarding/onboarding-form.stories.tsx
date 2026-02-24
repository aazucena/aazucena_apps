import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { OnboardingForm } from '@aazucena/forms/templates';

const meta = {
  title: 'Forms/Onboarding/OnboardingForm',
  component: OnboardingForm,
  parameters: { layout: 'centered', docs: { description: { component: 'Multi-step onboarding wizard: Profile → Preferences → Integrations.' } } },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof OnboardingForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
