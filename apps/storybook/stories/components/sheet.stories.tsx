import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@aazucena/ui';
import { Button, Input, Label, Badge, Avatar, AvatarFallback } from '@aazucena/ui';
import { Shield, Zap, Activity, Globe, CogFour as Settings, Terminal } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Radix UI based side-drawer primitive for supplemental task flows and navigation.
 * - **UX:** Features directional slide-in animations (Top, Bottom, Left, Right) with a backdrop blur overlay.
 * - **Accessibility:** Traps focus and supports keyboard ESC to close; semantic title and description required.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes with specialized `floating` and `inset` layouts.
 */
const meta = {
  title: 'Components/Primitives/Sheet',
  component: Sheet,
  subcomponents: {
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A content panel that slides in from the edge of the screen. Also known as a side drawer.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Sheet root is a controlled primitive
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a user profile editor.
 */
export const Basic: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Update_Profile_Metadata</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Identity_Configuration</SheetTitle>
          <SheetDescription>
            Update your node identifiers and public encryption tokens.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-10">
          <div className="space-y-2">
            <Label htmlFor="node-alias">NODE_ALIAS</Label>
            <Input id="node-alias" defaultValue="Aldrin_Azucena" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uplink-id">UPLINK_ID</Label>
            <Input id="uplink-id" defaultValue="0x7F42" />
          </div>
        </div>
        <SheetFooter>
          <Button className="w-full h-12 rounded-full uppercase font-black tracking-widest">
            Commit_Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * High-performance cyber variant with mono typography and technical status indicators.
 */
export const CyberTerminal: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="cyber">
          <Activity className="mr-2 animate-pulse" /> ACCESS_NODE_CONTROLS
        </Button>
      </SheetTrigger>
      <SheetContent variant="cyber" side="left" className="font-mono">
        <SheetHeader className="border-b border-cyan-500/10 pb-6 mb-6">
          <div className="flex items-center gap-3 text-cyan-500 mb-2">
            <Terminal size={18} />
            <SheetTitle className="text-cyan-500 font-mono italic uppercase tracking-tighter text-2xl">
              // CORE_SHELL_V4
            </SheetTitle>
          </div>
          <SheetDescription className="text-cyan-500/40 text-[10px] uppercase">
            Enclave_Authorization: LEVEL_01
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] opacity-40 uppercase">Ingestion_Pulse</span>
              <Badge variant="cyber" size="xs">
                NOMINAL
              </Badge>
            </div>
            <div className="h-1 w-full bg-cyan-500/10 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase opacity-20 tracking-[0.3em]">
              Quick_Actions
            </h4>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start italic hover:text-cyan-400 font-mono"
              >
                {'>'} FLUSH_BUFFER
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start italic hover:text-cyan-400 font-mono"
              >
                {'>'} ROTATE_KEYS
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start italic hover:text-rose-400 font-mono"
              >
                {'>'} EMERGENCY_REBOOT
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * Immersive glass variant using the "floating" layout preset.
 */
export const GlassFloating: Story = {
  render: () => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-sm" />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="glass"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full px-10 h-14 font-black uppercase tracking-widest"
          >
            Inspect_Environment
          </Button>
        </SheetTrigger>
        <SheetContent
          variant="glass"
          side="right"
          layout="floating"
          className="border-white/10 text-white w-[400px]"
        >
          <SheetHeader>
            <SheetTitle className="text-white text-3xl font-black tracking-tighter">
              Atmospheric_Unit
            </SheetTitle>
            <SheetDescription className="text-white/40">
              Real-time refraction metrics
            </SheetDescription>
          </SheetHeader>
          <div className="py-12 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
                <Globe size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase opacity-40">Current_Phase</span>
                <span className="text-sm font-bold">Mesosphere // Altitude: 62km</span>
              </div>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-xs leading-relaxed text-white/80">
                Adaptive glass surfacing is performing within optimal parameters. Backdrop blur
                constant set to **32px**.
              </p>
            </div>
          </div>
          <SheetFooter className="mt-auto pt-8 border-t border-white/10">
            <Button
              variant="outline"
              className="w-full h-12 rounded-full border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]"
            >
              Sync_Atmosphere
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
};
import { within, userEvent, expect, waitFor } from 'storybook/test';

/**
 * Automated interaction test: open sheet, verify visible, close via ESC.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Test Sheet</SheetTitle>
          <SheetDescription>Sheet interaction test</SheetDescription>
        </SheetHeader>
        <p className="text-sm mt-4">Sheet content is visible</p>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /open sheet/i }));
    // Sheet portals to body — wait for entry animation to complete
    const sheet = await within(document.body).findByRole('dialog');
    await waitFor(() => expect(sheet).toBeVisible(), { timeout: 2000 });
    // Close via ESC — Radix plays exit animation before unmounting
    await userEvent.keyboard('{Escape}');
    await waitFor(
      () => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );
  },
};
