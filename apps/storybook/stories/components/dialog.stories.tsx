import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
  DialogHero,
  DialogIcon,
} from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { Input } from '@aazucena/ui';
import { Label } from '@aazucena/ui';
import { Shield, Sparkles, Zap, Trash, Globe } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based modal system for focused tasks and confirmation.
 * - **UX:** Features `zoom-in` and `fade-in` entry animations with a backdrop blur overlay.
 * - **Architecture:** Uses CVA for 3 visual variants (`glass`, `cyber`) and 5 size presets.
 * - **Specialized Components:** Includes `DialogHero` and `DialogIcon` for high-fidelity branding within modals.
 * - **Accessibility:** Traps focus and supports keyboard ESC to close; semantic title and description required.
 */
type DialogStoryArgs = React.ComponentProps<typeof Dialog> & {
  variant?: 'default' | 'glass' | 'cyber';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'full';
};

const meta = {
  title: 'Components/Primitives/Dialog',
  component: Dialog,
  subcomponents: {
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogHero,
    DialogIcon,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A standard modal dialog box. Supports multiple visual themes and immersive header compositions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the dialog content',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'full'],
      description: 'The physical maximum width of the dialog',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<DialogStoryArgs>;

export default meta;
type Story = StoryObj<DialogStoryArgs>;

// --- STORIES ---

/**
 * Standard implementation for focused data entry or settings.
 */
export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update System Profile</Button>
      </DialogTrigger>
      <DialogContent size="default">
        <DialogHeader>
          <DialogTitle>Profile Configuration</DialogTitle>
          <DialogDescription>
            Update your identity tokens and global display preferences.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="id">Node_ID</Label>
            <Input id="id" defaultValue="0x7F42" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alias">Assigned_Alias</Label>
            <Input id="alias" defaultValue="Azucena_Primary" />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * High-performance cyber variant with hero header and technical icons.
 */
export const CyberSpec: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="cyber">Initiate Security Wipe</Button>
      </DialogTrigger>
      <DialogContent variant="cyber" size="lg">
        <DialogHero variant="cyber" className="h-40" />
        <div className="absolute top-32 left-8">
          <DialogIcon variant="cyber">
            <Shield className="size-8" />
          </DialogIcon>
        </div>
        <div className="pt-12 px-8">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="font-mono uppercase italic tracking-tighter text-2xl text-cyan-500">
              // TERMINATE_CORE_PROTOCOL
            </DialogTitle>
            <DialogDescription className="font-mono text-[10px] text-cyan-500/40">
              UPLINK_SECURITY_CLEARANCE: LEVEL_01
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="p-0 py-8 font-mono text-xs space-y-4">
            <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl text-rose-500">
              <p className="font-black uppercase mb-1 underline">WARNING_DESTRUCTION_NOTICE</p>
              <p>
                Proceeding will purge all cached telemetry packets and reset local node identifiers.
                This action is **IRREVERSIBLE**.
              </p>
            </div>
            <p className="opacity-60 italic">{'>'} Confirming authorization sequence...</p>
          </DialogBody>
        </div>
        <DialogFooter className="px-8 border-cyan-500/10">
          <Button variant="ghost" className="text-cyan-500">
            Abort
          </Button>
          <Button variant="destructive" className="px-10">
            PURGE_DATA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * Immersive glass variant with high-fidelity gradients and icons.
 */
export const GlassHero: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="glass" className="bg-primary/20 text-zinc-800 rounded-full px-8">
          <Sparkles className="mr-2" /> Upgrade Intel
        </Button>
      </DialogTrigger>
      <DialogContent variant="glass" className="p-0 border-white/10">
        <DialogHero className="h-48 flex items-center justify-center p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800" />
          <DialogIcon className="relative z-10 border-white/20 bg-white/10 text-zinc-800 size-20">
            <Zap className="size-10" />
          </DialogIcon>
        </DialogHero>
        <div className="p-8 pt-6">
          <DialogHeader className="p-0 text-center items-center">
            <DialogTitle className="text-zinc-800 text-3xl">Unlock Advanced Intel</DialogTitle>
            <DialogDescription className="text-zinc-800">
              Access real-time trajectory predictions and global node distribution.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="p-0 py-8 text-center text-zinc-800">
            <p className="text-sm">
              Join the 14,000+ engineers leveraging high-fidelity telemetry for biometric
              optimization.
            </p>
          </DialogBody>
          <DialogFooter className="p-0 border-white/10 justify-center">
            <Button
              variant="glass"
              size="lg"
              className="rounded-full px-12 bg-white border-zinc-800/80  text-black hover:bg-white/90"
            >
              Upgrade_Now
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  ),
};
import { within, userEvent, expect, waitFor } from '@storybook/test';

/**
 * Automated interaction test: open dialog via trigger, verify visible, close via ESC.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent size="default">
        <DialogHeader>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>Interaction test description.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Open dialog
    await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }));
    // Dialog portals to body — wait for entry animation to complete
    const dialog = await within(document.body).findByRole('dialog');
    await waitFor(() => expect(dialog).toBeVisible(), { timeout: 2000 });
    // Close via ESC — wait for exit animation + unmount
    await userEvent.keyboard('{Escape}');
    await waitFor(
      () => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );
  },
};
