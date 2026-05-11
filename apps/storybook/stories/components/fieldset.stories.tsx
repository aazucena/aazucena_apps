import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Fieldset, Input, Label, Checkbox, RadioGroup, RadioGroupItem, Button } from '@aazucena/ui';

const meta: Meta<typeof Fieldset> = {
  title: 'Components/Forms/Fieldset',
  component: Fieldset,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    legend: {
      control: 'text',
      description: 'The title or label for the fieldset group.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      description: 'Content of the fieldset (form elements).',
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the fieldset.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Default: Story = {
  args: {
    legend: 'Personal Information',
    children: (
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </div>
    ),
  },
};

export const CyberVariant: Story = {
  args: {
    legend: 'ACCESS_SETTINGS',
    children: (
      <div className="space-y-4">
        <div>
          <Label htmlFor="username_cyber" className="font-mono text-cyan-400">
            USERNAME
          </Label>
          <Input
            id="username_cyber"
            placeholder="GUEST_0x7F"
            variant="cyber"
            className="font-mono"
          />
        </div>
        <div>
          <Label htmlFor="password_cyber" className="font-mono text-cyan-400">
            PASSWORD
          </Label>
          <Input id="password_cyber" type="password" variant="cyber" className="font-mono" />
        </div>
        <RadioGroup defaultValue="protocol_tcp">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="protocol_tcp"
              id="protocol_tcp"
              className="text-cyan-400 border-cyan-500/50"
            />
            <Label htmlFor="protocol_tcp" className="font-mono text-cyan-500/80">
              PROTOCOL_TCP
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="protocol_udp"
              id="protocol_udp"
              className="text-cyan-400 border-cyan-500/50"
            />
            <Label htmlFor="protocol_udp" className="font-mono text-cyan-500/80">
              PROTOCOL_UDP
            </Label>
          </div>
        </RadioGroup>
        <Button variant="cyber">INITIATE</Button>
      </div>
    ),
    variant: 'cyber',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    legend: 'Display Preferences',
    children: (
      <div className="space-y-4">
        <div>
          <Label htmlFor="theme_glass" className="text-white">
            Theme
          </Label>
          <Input
            id="theme_glass"
            placeholder="Transparent"
            variant="glass"
            className="text-white placeholder:text-white/70"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="animations_glass"
            className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-blue-500"
          />
          <Label htmlFor="animations_glass" className="text-white/90">
            Enable Glass Animations
          </Label>
        </div>
        <Button variant="glass">Save Preferences</Button>
      </div>
    ),
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const NoLegend: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div>
          <Label htmlFor="address">Address Line 1</Label>
          <Input id="address" placeholder="123 Main St" />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Anytown" />
        </div>
      </div>
    ),
  },
};
