import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { MaskInput } from '@aazucena/ui';

const meta: Meta<typeof MaskInput> = {
  title: 'Components/Forms/MaskInput',
  component: MaskInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mask: {
      control: 'text',
      description: 'The mask string. Use keys from definitions.',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    replacement: {
      control: 'text',
      description: 'Character to replace mask placeholders with. Defaults to "_".',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
        defaultValue: { summary: '_' },
      },
    },
    value: {
      control: 'text',
      description: 'Controlled value of the input.',
      table: {
        category: 'State',
        type: { summary: 'string' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback function when the input value changes (unmasked value).',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the input.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    showMaskOnEmpty: {
      control: 'boolean',
      description: 'Whether to show the full mask even if the input is empty.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MaskInput>;

export const Default: Story = {
  args: {
    mask: '(999) 999-9999',
    placeholder: 'Enter phone number',
  },
};

export const MixedAlphaNumeric: Story = {
  args: {
    mask: 'UU-9999-****',
    placeholder: 'Code (XX-0000-AAAA)',
  },
};

export const HexColor: Story = {
  args: {
    mask: '#######',
    definitions: {
      '#': { pattern: /[0-9a-fA-F]/, transform: (c) => c.toUpperCase() },
    },
    placeholder: '#FFFFFF',
  },
};

export const CustomRegex: Story = {
  args: {
    mask: 'binary: BBBBBBBB',
    definitions: {
      B: { pattern: /[01]/ },
    },
    placeholder: 'binary: 10101010',
  },
};

export const CyberVariant: Story = {
  args: {
    mask: 'MAC: ##:##:##:##:##:##',
    placeholder: 'MAC Address',
    variant: 'cyber',
  },
};

export const GlassVariant: Story = {
  args: {
    mask: 'DATE: 99/99/9999',
    placeholder: 'Enter Date',
    variant: 'glass',
  },
};

export const ShowMaskAlways: Story = {
  args: {
    mask: '(999) 999-9999',
    showMaskOnEmpty: true,
  },
};
