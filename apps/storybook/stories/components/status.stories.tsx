import type { Meta, StoryObj } from '@storybook/react-vite';
import { Status, StatusDot, StatusLabel } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic primitive for multi-state signal indicators.
 * - **UX:** Features specialized pulsing and animation states to signify real-time relevance.
 * - **Aesthetics:** Aligned with site-wide themes (`pill`, `cyber`, `ghost`) with support for high-fidelity technical colors.
 * - **Composition:** Composed of a `StatusDot` (Visual) and `StatusLabel` (Semantic).
 */
const meta = {
  title: 'Components/Primitives/Status',
  component: Status,
  subcomponents: { StatusDot, StatusLabel } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A standard signal indicator used to represent the health, availability, or activity state of a system component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'pill',
        'ghost',
        'cyber',
        'nominal',
        'warning',
        'critical',
        'loading',
        'neutral',
      ],
      description: 'The visual theme of the indicator',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'radio',
      options: ['default', 'sm', 'lg'],
      description: 'The overall scale of the component',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a nominal system state.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Status {...args}>
      <StatusDot state="nominal" pulse />
      <StatusLabel variant="default">System_Stable</StatusLabel>
    </Status>
  ),
};

/**
 * High-performance cyber variant with neon glow and technical typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="p-8 bg-black border border-cyan-500/10 rounded-xl">
      <Status {...args}>
        <StatusDot state="intel" size="lg" pulse />
        <StatusLabel variant="cyber" className="text-cyan-400">
          ACTIVE_INFERENCE
        </StatusLabel>
      </Status>
    </div>
  ),
};

/**
 * Modern pill variant for high-visibility status chips.
 */
export const StatusPill: Story = {
  args: {
    variant: 'pill',
  },
  render: (args) => (
    <div className="flex gap-6">
      <Status {...args} className="border-emerald-500/20 bg-emerald-500/5">
        <StatusDot state="nominal" animated />
        <StatusLabel variant="bright" className="text-emerald-600 dark:text-emerald-400">
          OPERATIONAL
        </StatusLabel>
      </Status>
      <Status {...args} className="border-amber-500/20 bg-amber-500/5">
        <StatusDot state="warning" animated />
        <StatusLabel variant="bright" className="text-amber-600 dark:text-amber-400">
          DEGRADED
        </StatusLabel>
      </Status>
      <Status {...args} className="border-rose-500/20 bg-rose-500/5">
        <StatusDot state="critical" pulse />
        <StatusLabel variant="bright" className="text-rose-600 dark:text-rose-400">
          CRITICAL
        </StatusLabel>
      </Status>
    </div>
  ),
};

/**
 * Demonstrates the range of available dot sizes and animation states.
 */
export const IndicatorStates: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <div className="flex flex-col items-center gap-4">
        <StatusDot state="nominal" size="xs" />
        <p className="text-[10px] font-mono opacity-40 uppercase">XS</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <StatusDot state="nominal" size="sm" animated />
        <p className="text-[10px] font-mono opacity-40 uppercase">SM_Pulse</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <StatusDot state="nominal" size="default" pulse />
        <p className="text-[10px] font-mono opacity-40 uppercase">DF_Ping</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <StatusDot state="nominal" size="lg" />
        <p className="text-[10px] font-mono opacity-40 uppercase">LG</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <StatusDot state="nominal" size="xl" />
        <p className="text-[10px] font-mono opacity-40 uppercase">XL</p>
      </div>
    </div>
  ),
};

/**
 * Loading state with specialized animation.
 */
export const LoadingSequence: Story = {
  render: () => (
    <Status variant="ghost">
      <StatusDot state="loading" animated />
      <StatusLabel variant="compact">Synchronizing_Nodes...</StatusLabel>
    </Status>
  ),
};
