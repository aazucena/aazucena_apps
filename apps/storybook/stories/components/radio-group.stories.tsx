import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, RadioGroupItem } from '@aazucena/ui';
import { Label, Badge } from '@aazucena/ui';
import { Shield, Zap, Activity, Globe } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for mutually exclusive selection.
 * - **Accessibility:** Built-in focus management, keyboard navigation (Arrow keys), and standard ARIA roles.
 * - **Design:** Supports high-fidelity `cyber` variant with neon glowing indicators and precise border tokens.
 * - **UX:** Features smooth state transitions and active shadow elevation for the selected item.
 */
const meta = {
  title: 'Components/Primitives/RadioGroup',
  component: RadioGroup,
  subcomponents: { RadioGroupItem } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A set of checkable buttons—known as radio buttons—where no more than one button can be checked at a time.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a list of selectable preferences.
 */
export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="standard" className="w-64 gap-4">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="standard" id="r1" />
        <Label htmlFor="r1" className="cursor-pointer">
          Standard_Ingestion
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="priority" id="r2" />
        <Label htmlFor="r2" className="cursor-pointer">
          Priority_Uplink
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="batch" id="r3" />
        <Label htmlFor="r3" className="cursor-pointer">
          Batch_Processing
        </Label>
      </div>
    </RadioGroup>
  ),
};

/**
 * High-performance cyber variant with neon glow and mono typography.
 */
export const CyberTerminal: Story = {
  render: () => (
    <div className="p-8 border border-cyan-500/20 bg-black rounded-xl w-80">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="size-4 text-cyan-500 animate-pulse" />
        <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em]">
          # SELECT_PROTOCOL_PHASE
        </span>
      </div>
      <RadioGroup defaultValue="phase-1" className="gap-6">
        <div className="flex items-center justify-between group">
          <Label
            htmlFor="p1"
            className="font-mono text-xs text-cyan-400 cursor-pointer group-hover:text-cyan-300"
          >
            PHASE_01_BOOT
          </Label>
          <RadioGroupItem value="phase-1" id="p1" variant="cyber" />
        </div>
        <div className="flex items-center justify-between group">
          <Label
            htmlFor="p2"
            className="font-mono text-xs text-cyan-400 cursor-pointer group-hover:text-cyan-300"
          >
            PHASE_02_SYNC
          </Label>
          <RadioGroupItem value="phase-2" id="p2" variant="cyber" />
        </div>
        <div className="flex items-center justify-between group">
          <Label
            htmlFor="p3"
            className="font-mono text-xs text-cyan-400 cursor-pointer group-hover:text-cyan-300 text-rose-500"
          >
            PHASE_03_OVERRIDE
          </Label>
          <RadioGroupItem value="phase-3" id="p3" variant="cyber" className="border-rose-500/50" />
        </div>
      </RadioGroup>
    </div>
  ),
};

/**
 * Large format implementation using cards for more descriptive options.
 */
export const CardSelection: Story = {
  render: () => (
    <RadioGroup defaultValue="stable" className="grid grid-cols-2 gap-4 w-[500px]">
      <Label
        htmlFor="card-stable"
        className="flex flex-col items-center gap-4 rounded-3xl border-2 p-6 transition-all hover:bg-muted/50 cursor-pointer has-data-checked:border-primary has-data-checked:bg-primary/5"
      >
        <RadioGroupItem value="stable" id="card-stable" className="sr-only" />
        <Globe className="size-8 text-primary" />
        <div className="text-center">
          <span className="block font-black uppercase tracking-tighter">STABLE_RELAY</span>
          <span className="text-[10px] opacity-40 uppercase">Global_Availability</span>
        </div>
      </Label>

      <Label
        htmlFor="card-edge"
        className="flex flex-col items-center gap-4 rounded-3xl border-2 p-6 transition-all hover:bg-muted/50 cursor-pointer has-data-checked:border-primary has-data-checked:bg-primary/5"
      >
        <RadioGroupItem value="edge" id="card-edge" className="sr-only" />
        <Activity className="size-8 text-primary" />
        <div className="text-center">
          <span className="block font-black uppercase tracking-tighter">EDGE_UPLINK</span>
          <span className="text-[10px] opacity-40 uppercase">Low_Latency_Sync</span>
        </div>
      </Label>
    </RadioGroup>
  ),
};

/**
 * Visual feedback when the selection is in a disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="locked" disabled className="gap-4 opacity-50">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="locked" id="d1" />
        <Label htmlFor="d1">ADMIN_ENCLAVE_ONLY</Label>
      </div>
    </RadioGroup>
  ),
};
import { within, userEvent, expect } from 'storybook/test';

/**
 * Automated interaction test: click option, verify aria-checked updates.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <RadioGroup defaultValue="option-one" className="space-y-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-one" id="r1" />
        <label htmlFor="r1">Option One</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-two" id="r2" />
        <label htmlFor="r2">Option Two</label>
      </div>
    </RadioGroup>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const optionTwo = canvas.getByRole('radio', { name: /option two/i });
    await userEvent.click(optionTwo);
    await expect(optionTwo).toBeChecked();
    const optionOne = canvas.getByRole('radio', { name: /option one/i });
    await expect(optionOne).not.toBeChecked();
  },
};
