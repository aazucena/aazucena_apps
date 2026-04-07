import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataExplorer } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Complex recursive primitive for hierarchical data inspection.
 * - **UX:** Features specialized rendering for booleans (badges), numbers (semantic colors), and Markdown strings.
 * - **Logic:** Automatically detects "Knowledge Sources" and "Audit Failures" to apply conditional styling.
 * - **Variants:** Supports `glass` and `cyber` themes for integration into analytical terminals.
 */
const meta: Meta<typeof DataExplorer> = {
  title: 'Components/Data/DataExplorer',
  component: DataExplorer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A recursive JSON explorer with built-in semantic analysis. Automatically formats technical telemetry, knowledge sources, and audit failures.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the explorer',
      table: { category: 'Appearance' },
    },
    maxDepth: {
      control: 'number',
      description: 'Maximum recursion depth before truncating',
      table: { category: 'Behavior' },
    },
    initialExpanded: {
      control: 'boolean',
      description: 'Whether to expand objects by default',
      table: { category: 'Behavior' },
    },
    data: {
      control: 'object',
      description: 'The JSON payload to render',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof DataExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = {
  session_id: '7f8a9b2c-3d4e-5f6g-7h8i',
  timestamp: '2026-02-13T14:30:00Z',
  is_valid: true,
  metadata: {
    origin: 'Vercel_Edge',
    geo: {
      city: 'Berlin',
      country: 'DE',
      coords: [52.52, 13.405],
    },
    system: {
      version: '1.2.0',
      kernel: 'stable',
      flags: ['INGESTION', 'PULSE_SYNC'],
    },
  },
  buffer: [12, 45, 89, 32, 11],
  reasoning:
    '[KNOWLEDGE_SOURCE] Data validated against ClickHouse schema. No anomalies detected. Full trace available in secondary buffer.',
};

/**
 * Standard implementation showing a valid technical telemetry payload.
 */
export const Basic: Story = {
  args: {
    data: mockData,
    variant: 'default',
    maxDepth: 5,
    initialExpanded: true,
  },
  render: (args) => (
    <div className="w-[600px] h-[400px] overflow-auto p-8 border rounded-[2rem] bg-card shadow-2xl">
      <DataExplorer {...args} />
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[600px] h-[400px] overflow-auto p-8 border border-cyan-500/20 bg-black rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      <DataExplorer {...args} />
    </div>
  ),
};

/**
 * Demonstrates the automatic "Critical_Audit_Failure" rendering mode.
 */
export const AuditFailure: Story = {
  args: {
    ...Basic.args,
    data: {
      ...mockData,
      is_valid: false,
      error: 'INGESTION_LAG_EXCEEDED_THRESHOLD',
      critical_reasoning:
        'Node US_EAST_1 is reporting a pulse deviation of >50ms. Immediate re-sync required.',
    },
  },
  render: (args) => (
    <div className="w-[600px] h-[450px] overflow-auto p-8 border border-rose-500/20 bg-card rounded-[2rem] shadow-2xl">
      <DataExplorer {...args} />
    </div>
  ),
};

/**
 * Showcase of Markdown and Knowledge Source rendering within the tree.
 */
export const KnowledgeSignal: Story = {
  args: {
    ...Basic.args,
    data: {
      source: '[KNOWLEDGE_SOURCE]',
      analysis:
        '### System Analysis\n- **Stability:** 99.9%\n- **Risk:** Low\n\nThe internal kernel has reported successful pulse synchronization across all active nodes.',
      is_valid: true,
    },
  },
  render: (args) => (
    <div className="w-[600px] p-8 border rounded-[2rem] bg-card">
      <DataExplorer {...args} />
    </div>
  ),
};
