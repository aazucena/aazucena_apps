import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatTerminalOutput } from '@aazucena/ui';

const meta: Meta<typeof ChatTerminalOutput> = {
  title: 'Components/Chat/ChatTerminalOutput',
  component: ChatTerminalOutput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    output: {
      control: 'text',
      description: 'The raw terminal output string to display.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional title for the terminal output section.',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Terminal Output' },
      },
    },
    language: {
      control: 'text',
      description:
        'Programming language for syntax highlighting (e.g., "bash", "json", "typescript").',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: 'bash' },
      },
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of the output area (e.g., "200px", "50vh").',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
        defaultValue: { summary: '200px' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatTerminalOutput>;

const sampleBashOutput = `
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   src/App.js
        modified:   src/index.css

no changes added to commit (use "git add" and/or "git commit -a")
`;

const sampleJsonOutput = `
{
  "status": "success",
  "data": {
    "userId": "usr_xyz123",
    "timestamp": "2024-03-01T10:00:00Z",
    "events": [
      {"type": "login", "details": "User logged in"},
      {"type": "data_fetch", "details": "Fetched 100 records"}
    ]
  },
  "message": "Operation completed successfully."
}
`;

export const Default: Story = {
  args: {
    output: sampleBashOutput,
  },
};

export const JsonOutput: Story = {
  args: {
    output: sampleJsonOutput,
    title: 'API Response Log',
    language: 'json',
  },
};

export const CyberVariant: Story = {
  args: {
    output: `
$ npm run dev
> project@1.0.0 dev
> next dev

ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully in 1234 ms (100 modules)
`,
    variant: 'cyber',
    title: 'Live Deployment Log',
  },
};

export const GlassVariant: Story = {
  args: {
    output: `
--- START SYSTEM BOOT ---
[ OK ] Services initialized.
[ OK ] Network connectivity established.
[WARN] Minor resource contention detected.
--- END SYSTEM BOOT ---
`,
    variant: 'glass',
    title: 'System Boot Sequence',
    maxHeight: '150px',
  },
};

export const LongOutput: Story = {
  args: {
    output: Array(50)
      .fill(null)
      .map(
        (_, i) =>
          `[${i.toString().padStart(3, '0')}] Processing data chunk ${i + 1} of 50. Status: OK.`,
      )
      .join(''),
    title: 'Data Processing Stream',
  },
};
