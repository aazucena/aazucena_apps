import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatTool } from '@aazucena/ui';

const meta: Meta<typeof ChatTool> = {
  title: 'Components/Chat/ChatTool',
  component: ChatTool,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    toolName: {
      control: 'text',
      description: 'The name of the tool being executed.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    input: {
      control: 'object',
      description: 'The input parameters provided to the tool.',
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    output: {
      control: 'object',
      description: "The output or result from the tool's execution.",
      table: {
        category: 'Content',
        type: { summary: 'object' },
      },
    },
    status: {
      control: 'select',
      options: ['success', 'failure', 'executing'],
      description: 'The execution status of the tool.',
      table: {
        category: 'State',
        type: { summary: "'success' | 'failure' | 'executing'" },
      },
    },
    error: {
      control: 'text',
      description: 'Error message if the tool execution failed.',
      table: {
        category: 'State',
        type: { summary: 'string' },
      },
    },
    isExpanded: {
      control: 'boolean',
      description: 'Initial expanded state of the tool details.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the tool card.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatTool>;

export const DefaultSuccess: Story = {
  args: {
    toolName: 'SearchKnowledgeBase',
    input: { query: 'latest AI research', count: 5 },
    output: { results: ['Paper A', 'Paper B'], total: 20 },
    status: 'success',
  },
};

export const Executing: Story = {
  args: {
    toolName: 'GenerateImage',
    input: { prompt: 'a cat wearing a spacesuit', style: 'photorealistic' },
    status: 'executing',
  },
};

export const Failure: Story = {
  args: {
    toolName: 'TranslateText',
    input: { text: 'Hello', target_language: 'Klingon' },
    error: 'Language "Klingon" not supported.',
    status: 'failure',
    isExpanded: true,
  },
};

export const CyberVariant: Story = {
  args: {
    toolName: 'DeployService',
    input: { service_name: 'AuthGateway', version: '1.2.0' },
    output: { status: 'deployment started', deployment_id: 'xyz123' },
    status: 'success',
    variant: 'cyber',
    isExpanded: true,
  },
};

export const GlassVariant: Story = {
  args: {
    toolName: 'FetchWeatherData',
    input: { location: 'London', unit: 'celsius' },
    output: { temperature: 15, conditions: 'Cloudy' },
    status: 'success',
    variant: 'glass',
  },
};

export const CustomInputOutput: Story = {
  args: {
    toolName: 'CustomProcessor',
    input: {
      data: [
        { id: 1, value: 'A' },
        { id: 2, value: 'B' },
      ],
      config: { transform: true },
    },
    output: {
      processed: true,
      items: [
        { id: 1, value: 'A_processed' },
        { id: 2, value: 'B_processed' },
      ],
    },
    status: 'success',
    isExpanded: false,
  },
};

export const LongOutput: Story = {
  args: {
    toolName: 'LongRunningReport',
    input: { reportType: 'full_annual_summary', year: 2023 },
    output: {
      reportId: 'rep-2023-001',
      summary:
        'This is a very long summary of the annual report for the year 2023, detailing all key performance indicators, financial statements, and strategic initiatives. The report covers a wide range of topics including market share, customer acquisition costs, operational efficiencies, and future growth projections across all business units. It also includes an in-depth analysis of competitive landscapes and emerging market trends. This section is just a snippet of the full report content which spans over 50 pages of detailed data and graphs.',
      status: 'generated',
    },
    status: 'success',
    isExpanded: true,
  },
};
