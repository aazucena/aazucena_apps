import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { CodeBlockCommand } from '@aazucena/ui';

const meta: Meta<typeof CodeBlockCommand> = {
  title: 'Components/Content/CodeBlockCommand',
  component: CodeBlockCommand,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    command: {
      control: 'text',
      description: 'The command string to display. Used if methods is not provided.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    methods: {
      control: 'object',
      description: 'A set of command methods (e.g. { pnpm: "...", npm: "..." }).',
      table: {
        category: 'Content',
        type: { summary: 'Record<string, string>' },
      },
    },
    storageKey: {
      control: 'text',
      description: "Key for storing the user's preferred method in localStorage.",
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
        defaultValue: { summary: 'aazucena-command-preference' },
      },
    },
    output: {
      control: 'text',
      description: 'Optional output string to display after the command.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    language: {
      control: 'text',
      description: 'Language for syntax highlighting (e.g., "bash", "json", "typescript").',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'bash' },
      },
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Toggle line number gutter visibility.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    copyable: {
      control: 'boolean',
      description: 'Show copy-to-clipboard button.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    fileName: {
      control: 'text',
      description: 'Optional file name shown in the header bar.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'terminal' },
      },
    },
    showCommandSymbol: {
      control: 'boolean',
      description: 'Show the leading command symbol (e.g., "$").',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    typingEffect: {
      control: 'boolean',
      description: 'If true, simulates typing out the command and output.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    typingDelay: {
      control: { type: 'number', min: 10, max: 200, step: 10 },
      description: 'Delay between characters for the typing effect in ms.',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '50' },
      },
    },
    enableTabs: {
      control: 'boolean',
      description: 'If true, shows Command and Output in separate tabs.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the code block.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlockCommand>;

const multiMethodSample = {
  pnpm: 'pnpm add @aazucena/ui',
  npm: 'npm install @aazucena/ui',
  yarn: 'yarn add @aazucena/ui',
  bun: 'bun add @aazucena/ui',
};

export const Default: Story = {
  args: {
    methods: multiMethodSample,
  },
};

export const PersistenceTest: Story = {
  args: {
    methods: {
      pip: 'pip install aazucena-analytics',
      uv: 'uv add aazucena-analytics',
      conda: 'conda install aazucena-analytics',
    },
    storageKey: 'python-method-preference',
    fileName: 'setup_env.py',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Change the method and refresh the page (or switch stories). Your choice will be remembered.',
      },
    },
  },
};

export const WithOutputTabs: Story = {
  args: {
    methods: multiMethodSample,
    output: `Packages: +154
Progress: resolved 3682, reused 0, downloaded 0, added 0, done
...
Done in 9.4s`,
    enableTabs: true,
    fileName: 'pnpm-output.log',
  },
};

export const CombinedViewNoTabs: Story = {
  args: {
    command: 'git status',
    output: `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`,
    enableTabs: false,
  },
};

export const CyberVariant: Story = {
  args: {
    methods: {
      SSH: 'ssh root@aazucena.io',
      TELNET: 'telnet aazucena.io 23',
    },
    variant: 'cyber',
    fileName: 'REMOTE_ACCESS',
    typingEffect: true,
    typingDelay: 40,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8 w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    methods: {
      curl: 'curl -X GET https://api.aazucena.me/v1/health',
      httpie: 'http GET https://api.aazucena.me/v1/health',
    },
    variant: 'glass',
    fileName: 'api_probe',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8 w-[600px]">
        <Story />
      </div>
    ),
  ],
};
