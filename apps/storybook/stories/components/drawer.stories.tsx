import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { Activity, CogFour as Settings, Shield } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Bottom-anchored primitive for mobile-first interactions and secondary task flows.
 * - **UX:** Supports swipe-to-close gestures and provides a visual handle for intuitive interaction.
 * - **Accessibility:** Uses `vaul` for accessible focus trapping and modal-style ARIA attributes.
 * - **Design:** Optimized for high-density settings and quick configuration panels on touch devices.
 */
const meta = {
  title: 'Components/Primitives/Drawer',
  component: Drawer,
  subcomponents: {
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A drawer component for mobile-friendly modal experiences. Slides from the bottom and supports nested content.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a metric adjustment flow.
 */
export const Basic: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Adjust Node Goal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Signal Target</DrawerTitle>
            <DrawerDescription>Set your daily node ingestion goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-8 text-center space-y-4">
            <div className="text-7xl font-black tracking-tighter">14.2K</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
              NODES_PER_CYCLE
            </p>
          </div>
          <DrawerFooter>
            <Button className="w-full">Initialize</Button>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * Technical implementation showing a system settings panel.
 */
export const SystemSettings: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2" /> Global Protocol Settings
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-[2rem]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="border-b border-current/5 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Shield size={24} />
              </div>
              <div className="text-left">
                <DrawerTitle className="text-2xl font-black tracking-tighter uppercase">
                  PROTOCOL_0x7F
                </DrawerTitle>
                <DrawerDescription className="font-mono text-[10px] uppercase">
                  Security_Enclave_V4
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-2xl bg-muted/20">
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest">
                Encryption_Sync
              </span>
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-2xl bg-muted/20">
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest">
                Knowledge_Index
              </span>
              <span className="font-mono text-xs text-primary">STABLE</span>
            </div>
          </div>
          <DrawerFooter className="pb-12">
            <Button
              size="lg"
              className="w-full h-14 rounded-full font-black uppercase tracking-widest"
            >
              Apply_Sequence
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

/**
 * High-performance state representation within a drawer.
 */
export const LiveMonitor: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="cyber">
          <Activity className="mr-2 animate-pulse" /> OPEN_PULSE_MONITOR
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-zinc-950 text-white border-white/5">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-cyan-500 font-mono italic">// LIVE_TRAJECTORY</DrawerTitle>
            <DrawerDescription className="text-white/40 font-mono text-[10px]">
              Real-time node telemetry
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-8 py-12">
            <div className="h-24 flex items-end gap-1">
              {[40, 70, 45, 90, 65, 80, 30, 50, 85, 60, 40, 75].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-cyan-500/20 rounded-t-sm hover:bg-cyan-500 transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <DrawerFooter className="pb-12 border-t border-white/5">
            <Button variant="cyber" className="w-full">
              REFRESH_UPLINK
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};
import { within, userEvent, expect } from 'storybook/test';

/**
 * Automated interaction test: open drawer, verify visible, close via ESC.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Test Drawer</DrawerTitle>
          <DrawerDescription>Drawer interaction test</DrawerDescription>
        </DrawerHeader>
        <p className="p-4 text-sm">Drawer content is visible</p>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /open drawer/i }));
    const drawer = await within(document.body).findByRole('dialog');
    await expect(drawer).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};
