import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@aazucena/ui';
import { Button, Badge } from '@aazucena/ui';
import { Shield, Zap, Activity, Globe, Plus, InfoCircle as Info } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for supplemental contextual information.
 * - **UX:** Features smooth `fade-in` and `zoom-in` animations with smart positioning via `sideOffset`.
 * - **Accessibility:** Uses standard ARIA attributes for managing visibility; non-interactive content by default.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes.
 * - **Performance:** Lightweight portal-based implementation to avoid z-index and overflow issues.
 */
const meta = {
  title: 'Components/Primitives/Tooltip',
  component: Tooltip,
  subcomponents: { TooltipTrigger, TooltipContent, TooltipProvider } as any,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    delayDuration: {
      control: 'number',
      description: 'The duration from when the mouse enters the trigger until the tooltip opens.',
      table: { category: 'Behavior', defaultValue: { summary: '700' } },
    },
    disableHoverableContent: {
      control: 'boolean',
      description: 'Prevents content from being hoverable',
      table: { category: 'Behavior' },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for providing quick hints on icons.
 */
export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-xl">
          <Plus size={18} />
          <span className="sr-only">New_Project</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Create_New_Node</p>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-3 p-4 bg-black border border-cyan-500/10 rounded-xl cursor-help group">
          <Activity size={16} className="text-cyan-500" />
          <span className="font-mono text-xs text-cyan-400 group-hover:text-cyan-300">
            UPLINK_US_EAST
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent variant="cyber" side="top" className="font-mono p-4">
        <div className="space-y-2">
          <div className="flex justify-between gap-8 text-[9px] uppercase font-black italic text-cyan-500/60">
            <span># BUFFER_SYNC</span>
            <Badge variant="cyber" size="xs">
              NOMINAL
            </Badge>
          </div>
          <p className="text-[10px] text-cyan-50">Ingestion rate: 450 packets/s</p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Immersive glass variant, ideal for placement over cinematic backgrounds.
 */
export const GlassAtmospheric: Story = {
  render: () => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" />
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-white hover:opacity-80 transition-opacity">
            <Info size={24} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          variant="glass"
          side="bottom"
          className="w-64 border-white/10 text-white p-4"
        >
          <div className="flex flex-col gap-2">
            <h4 className="font-black uppercase tracking-tighter">Atmospheric_Unit</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Real-time environmental monitoring with adaptive frosted surfaces and backdrop blur.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/**
 * Demonstrates various positioning options.
 */
export const Positioning: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-12">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">Tooltip_Top</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Tooltip_Bottom</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">Tooltip_Left</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">Tooltip_Right</TooltipContent>
      </Tooltip>
    </div>
  ),
};
import { within, userEvent, expect, waitFor } from 'storybook/test';

/**
 * Automated interaction test: hover trigger to reveal tooltip.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" aria-label="Help">
          Help
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tooltip is visible</p>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /help/i });
    // Hover to show tooltip
    await userEvent.hover(trigger);
    // Use role="tooltip" to avoid matching multiple text nodes
    const tip = await within(document.body).findByRole('tooltip');
    await waitFor(() => expect(tip).toBeVisible(), { timeout: 2000 });
    // Move away
    await userEvent.unhover(trigger);
  },
};
