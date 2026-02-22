import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@aazucena/ui';
import { Button, Input, Label, Badge } from '@aazucena/ui';
import { CogFour as Cog, Activity, Shield, Zap, Globe, InfoCircle as Info } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for small informational or interactive overlays.
 * - **UX:** Features sequential animations (`fade-in`, `zoom-in`) and smart positioning via `sideOffset`.
 * - **Accessibility:** Built-in focus management and keyboard ESC to close; essential for context-specific actions.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes.
 */
type PopoverStoryArgs = React.ComponentProps<typeof Popover> & {
  variant?: 'default' | 'glass' | 'cyber';
  side?: 'top' | 'bottom' | 'left' | 'right';
};

const meta = {
  title: 'Components/Primitives/Popover',
  component: Popover,
  subcomponents: { PopoverTrigger, PopoverContent, PopoverAnchor } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust popover component for displaying content relative to a trigger element. Ideal for small settings, help text, or tool palettes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the popover content',
      table: { category: 'Appearance' },
    },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The preferred side for positioning',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<PopoverStoryArgs>;

export default meta;
type Story = StoryObj<PopoverStoryArgs>;

// --- STORIES ---

/**
 * Standard implementation showing a quick settings panel.
 */
export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Layer_Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6 rounded-2xl shadow-2xl">
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="font-black tracking-tighter uppercase text-sm">Visual_Coordinates</h4>
            <p className="text-[10px] text-muted-foreground uppercase">
              Configure spatial distribution.
            </p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width" className="text-[10px] font-bold">
                WIDTH
              </Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8 text-xs" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height" className="text-[10px] font-bold">
                HEIGHT
              </Label>
              <Input id="height" defaultValue="300px" className="col-span-2 h-8 text-xs" />
            </div>
          </div>
          <Button size="sm" className="w-full rounded-lg uppercase font-bold text-[10px]">
            Apply_Coordinates
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical context.
 */
export const CyberSpec: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="cyber">
          <Cog className="mr-2 animate-spin-slow" /> CONFIG_OVERRIDE
        </Button>
      </PopoverTrigger>
      <PopoverContent variant="cyber" side="right" className="w-72 font-mono p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-cyan-500 mb-2">
            <Activity size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase italic tracking-tighter">
              // KERNEL_PARAMETERS
            </span>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase">
                <span className="opacity-40">Signal_Gain</span>
                <span className="text-cyan-400">85.4%</span>
              </div>
              <div className="h-1 bg-cyan-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[85%] shadow-[0_0_8px_rgba(6,182,212,1)]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase">
                <span className="opacity-40">Uplink_Buffer</span>
                <span className="text-emerald-400">0ms</span>
              </div>
              <div className="h-1 bg-emerald-500/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full shadow-[0_0_8px_rgba(16,185,129,1)]" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-cyan-500/10 flex justify-between items-center">
            <span className="text-[9px] opacity-40 uppercase">Protection_Layer</span>
            <Badge variant="cyber" size="xs">
              LOCKED
            </Badge>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * Immersive glass variant, ideal for placement over complex backgrounds.
 */
export const GlassInfo: Story = {
  render: () => (
    <div className="p-20 bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Info size={20} />{' '}
            <span className="text-xs font-black uppercase tracking-widest">Environment_Intel</span>
          </button>
        </PopoverTrigger>
        <PopoverContent variant="glass" side="top" className="w-80 border-white/10 text-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Globe size={16} />
              </div>
              <h4 className="font-black uppercase tracking-tighter">Atmospheric_Unit</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Active telemetry indicates nominal refraction across all frosted surfaces. Backdrop
              blur is performing within optimal parameters.
            </p>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[9px] font-bold text-white/40 uppercase">Phase: EXOSPHERE</span>
              <div className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
import { within, userEvent, expect } from '@storybook/test';

/**
 * Automated interaction test: click trigger to open popover, verify content, close via ESC.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <p className="text-sm">Popover content is visible</p>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /open popover/i });
    // Open popover
    await userEvent.click(trigger);
    // Popover portals to body
    const content = await within(document.body).findByText('Popover content is visible');
    await expect(content).toBeVisible();
    // Close via ESC
    await userEvent.keyboard('{Escape}');
  },
};
