import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { ProfileForm } from '@aazucena/forms/templates';
const meta = {
  title: 'Forms/Account/ProfileForm',
  component: ProfileForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'glass', 'cyber'], table: { category: 'Appearance' } } },
  args: { onSuccess: fn(), onError: fn() },
} satisfies Meta<typeof ProfileForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default' } };
export const Glass: Story = { args: { variant: 'glass' } };
export const Cyber: Story = { args: { variant: 'cyber' } };
export const WithDefaultValues: Story = {
  args: {
    variant: 'default',
    defaultValues: {
      displayName: 'Aldrin Azucena',
      bio: 'Full-stack engineer & creative technologist.',
      location: 'Manila, PH',
      timezone: 'Asia/Manila',
      preferredTheme: 'dark',
      socialLinks: { github: 'aazucena', twitter: '@aazucena' },
    },
  },
};
