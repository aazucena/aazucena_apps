import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@aazucena/ui';
import { Label, Badge, Button } from '@aazucena/ui';
import { Terminal, Shield, Zap, Activity } from '@aazucena/icons';
import { within, userEvent, expect } from '@storybook/test';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic input primitive for multi-line text-based data entry.
 * - **Accessibility:** Supports standard HTML textarea attributes; focus rings and error states are visually distinct.
 * - **Design:** Includes high-fidelity `glass` and `cyber` variants aligned with the atmospheric design system.
 * - **UX:** Features `min-h-[60px]` base height and standard padding scales for consistent text flow.
 */
const meta = {
  title: 'Components/Primitives/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile multi-line input component for long-form text, code snippets, or system logs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the input',
      table: { category: 'Appearance' }
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents user interaction',
      table: { category: 'State' }
    },
    rows: {
      control: 'number',
      description: 'Initial number of visible lines',
      table: { category: 'Layout' }
    }
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for general feedback or messages.
 */
export const Basic: Story = {
  args: {
    placeholder: 'Enter detailed message here...',
    variant: 'default',
    rows: 4,
  },
  render: (args) => (
    <div className="w-[450px] space-y-3">
      <Label className="font-bold tracking-tight">Full_Message_Content</Label>
      <Textarea {...args} className="rounded-2xl border-zinc-200" />
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
    placeholder: 'PASTE_SIGNAL_TRACE...',
    rows: 6,
    className: 'font-mono text-xs uppercase tracking-widest',
  },
  render: (args) => (
    <div className="w-[500px] p-8 bg-black border border-cyan-500/10 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Terminal className="size-4 text-cyan-500 animate-pulse" />
        <span className="font-mono text-[10px] text-cyan-500 uppercase tracking-[0.3em]">// KERNEL_INPUT_SHELL</span>
      </div>
      <Textarea {...args} />
      <div className="flex justify-between items-center mt-6">
        <p className="text-[9px] font-mono text-cyan-500/40 uppercase italic">Awaiting_Secure_Uplink</p>
        <Button variant="cyber" size="sm">TRANSMIT</Button>
      </div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over cinematic backgrounds.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
    placeholder: 'Document your architectural philosophy...',
    rows: 5,
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <div className="w-[450px] space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">ATMOSPHERE_V1</Badge>
          <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <Textarea {...args} className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-3xl p-6" />
      </div>
    </div>
  ),
};

/**
 * Visual feedback for textarea in a disabled state.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'SYSTEM_LOCK_ACTIVE: Unauthorized access to this buffer is prohibited by Security_Enclave_V4.',
    variant: 'cyber',
    rows: 3,
  },
  render: (args) => (
    <div className="w-[400px]">
      <Textarea {...args} />
    </div>
  ),
};
/**
 * Automated interaction test: type in textarea, verify value updates.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} placeholder="Type your message..." />
    </div>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox');
    await userEvent.type(textarea, 'Hello from interaction test');
    await expect(textarea).toHaveValue('Hello from interaction test');
    await userEvent.clear(textarea);
    await expect(textarea).toHaveValue('');
  },
};
