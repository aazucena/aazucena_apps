import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@aazucena/ui';
import { Label, Badge } from '@aazucena/ui';
import { Shield, Zap, Activity, Globe } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for boolean toggle interaction.
 * - **Accessibility:** Built with standard `role="switch"` and `aria-checked` attributes; supports keyboard SPACE to toggle.
 * - **UX:** Features smooth CSS transitions for thumb movement and background state changes.
 * - **Design:** Supports high-fidelity `cyber` and `logic` (technical settings) variants with integrated neon glow.
 */
const meta = {
  title: 'Components/Primitives/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A control that allows the user to toggle between on and off states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber', 'logic'],
      description: 'The visual theme of the toggle',
      table: { category: 'Appearance' }
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction',
      table: { category: 'State' }
    },
    checked: {
      control: 'boolean',
      description: 'The checked state of the switch',
      table: { category: 'State' }
    }
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a basic setting toggle.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} id="basic-opt" />
      <Label htmlFor="basic-opt" className="cursor-pointer font-bold">Enable_Notifications</Label>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon glow and technical context.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="p-8 bg-black border border-cyan-500/10 rounded-xl w-80">
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-cyan-500" />
          <Label htmlFor="cyber-lock" className="font-mono text-xs text-cyan-400 cursor-pointer group-hover:text-cyan-300">
            ENCRYPTION_SYNC
          </Label>
        </div>
        <Switch {...args} id="cyber-lock" />
      </div>
    </div>
  ),
};

/**
 * Specialized technical toggle for critical logic overrides.
 */
export const LogicOverride: Story = {
  args: {
    variant: 'logic',
  },
  render: (args) => (
    <div className="flex items-center gap-4 px-6 py-3 border-2 border-dashed rounded-2xl bg-muted/5">
      <Zap size={14} className="text-rose-500 animate-pulse" />
      <Label htmlFor="logic-opt" className="text-[10px] font-black uppercase tracking-widest opacity-60 cursor-pointer">
        Force_Reset_Sequence
      </Label>
      <Switch {...args} id="logic-opt" />
    </div>
  ),
};

/**
 * Comprehensive settings list using switches.
 */
export const SettingsList: Story = {
  render: () => (
    <div className="w-80 space-y-6 p-6 border rounded-2xl bg-card shadow-lg">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 px-1">SYSTEM_PREFERENCES</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="s1" className="text-sm font-medium">Automatic_Updates</Label>
          <Switch id="s1" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="s2" className="text-sm font-medium">Telemetry_Ingestion</Label>
          <Switch id="s2" defaultChecked />
        </div>
        <div className="flex items-center justify-between opacity-50">
          <Label htmlFor="s3" className="text-sm font-medium">Enclave_Access</Label>
          <Switch id="s3" disabled />
        </div>
      </div>
    </div>
  ),
};
