import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { WaitlistForm } from '@aazucena/forms/templates';

const meta = {
  title: 'Forms/Onboarding/WaitlistForm',
  component: WaitlistForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof WaitlistForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' }, decorators: [(Story) => <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-8"><Story /></div>] };
export const Cyber: Story = { args: { variant: 'cyber' }, decorators: [(Story) => <div className="rounded-2xl border border-cyan-500/20 bg-black p-8"><Story /></div>] };
