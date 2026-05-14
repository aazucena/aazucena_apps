import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { MicSelector } from '@aazucena/ui';

const meta: Meta<typeof MicSelector> = {
  title: 'Components/Forms/MicSelector',
  component: MicSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'no-vitest'],
  argTypes: {
    selectedDeviceId: {
      control: 'text',
      description: 'The ID of the currently selected microphone device.',
      table: {
        category: 'State',
        type: { summary: 'string' },
      },
    },
    onSelectDevice: {
      action: 'deviceSelected',
      description: 'Callback function when a new microphone device is selected.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the select input.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Select Microphone' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the container and select input.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MicSelector>;

export const Default: Story = {
  args: {
    selectedDeviceId: 'default',
  },
};

export const CyberVariant: Story = {
  args: {
    selectedDeviceId: 'mic-id-123',
    variant: 'cyber',
    placeholder: 'CHOOSE_AUDIO_INPUT',
  },
};

export const GlassVariant: Story = {
  args: {
    selectedDeviceId: 'mic-id-456',
    variant: 'glass',
    placeholder: 'Select Input Array',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

// This story simulates a scenario where no microphones are found.
// Note: This relies on the browser environment and may not always
// perfectly simulate an actual "no device" scenario without mocking
// navigator.mediaDevices.enumerateDevices.
export const NoMicrophonesFound: Story = {
  args: {
    selectedDeviceId: 'none',
  },
  // To effectively test this, you might need to mock navigator.mediaDevices in Storybook setup
  // For now, it will render "Select Microphone" with an empty dropdown if no devices are detected
  // or "No microphones found." if enumerateDevices returns empty.
};

// This story simulates a scenario where microphone access is denied.
// Similar to NoMicrophonesFound, proper testing might require mocking.
export const MicrophoneAccessDenied: Story = {
  args: {
    selectedDeviceId: 'denied',
  },
  // To effectively test this, you might need to mock navigator.mediaDevices in Storybook setup
  // For now, it will render "Microphone access required."
};
