import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatModelSelector, type AiModel } from '@aazucena/ui';

const meta: Meta<typeof ChatModelSelector> = {
  title: 'Components/Chat/ChatModelSelector',
  component: ChatModelSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    models: {
      control: 'object',
      description: 'An array of AI model objects, each with id, name, description, and provider.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    selectedModelId: {
      control: 'text',
      description: 'The ID of the currently selected model.',
      table: {
        category: 'State',
        type: { summary: 'string' },
      },
    },
    onSelectModel: {
      action: 'modelSelected',
      description: 'Callback function when a new model is selected.',
      table: {
        category: 'Behavior',
        type: { summary: '(modelId: string) => void' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the select input.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Select AI Model' },
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
type Story = StoryObj<typeof ChatModelSelector>;

const sampleModels: AiModel[] = [
  { id: 'gpt4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Latest flagship model from OpenAI.' },
  { id: 'claude35', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Fast, intelligent, and cost-effective model.' },
  { id: 'geminipro', name: 'Gemini Pro', provider: 'Google', description: 'Google\'s multimodal model.' },
  { id: 'llama3', name: 'Llama 3 70B', provider: 'Meta', description: 'Open-source model from Meta.' },
];

export const Default: Story = {
  args: {
    models: sampleModels,
    selectedModelId: 'gpt4o',
  },
};

export const CyberVariant: Story = {
  args: {
    models: sampleModels,
    selectedModelId: 'claude35',
    variant: 'cyber',
    placeholder: 'CHOOSE_PROTOCOL',
  },
};

export const GlassVariant: Story = {
  args: {
    models: sampleModels,
    selectedModelId: 'geminipro',
    variant: 'glass',
    placeholder: 'Select Agent Core',
  },
};

export const NoModelSelected: Story = {
  args: {
    models: sampleModels,
    selectedModelId: '',
  },
};

export const LimitedModels: Story = {
  args: {
    models: sampleModels.slice(0, 2),
    selectedModelId: 'gpt4o',
  },
};
