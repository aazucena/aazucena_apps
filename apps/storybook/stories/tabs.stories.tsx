import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@aazucena/ui';
import { Card, CardContent } from '@aazucena/ui';
import { Activity, Database, Globe, Shield, Zap, Terminal } from '@aazucena/icons';
import { Badge } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI based primitive for organizing content into navigable views.
 * - **UX:** Features smooth state transitions and tactile feedback. Supports a unique `phone` dial variant for mobile-first circular navigation.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) featuring high-fidelity `backdrop-blur` and neon glowing indicators.
 * - **Accessibility:** Built with standard `role="tablist"`, `role="tab"`, and `role="tabpanel"`; fully keyboard navigable (Arrow keys).
 */
const meta = {
  title: 'Components/Primitives/Tabs',
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Tabs root is a controlled primitive
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for simple account or preference settings.
 */
export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="rounded-2xl shadow-lg border-zinc-200">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Update your identity tokens and global display preferences.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card className="rounded-2xl shadow-lg border-zinc-200">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Manage your secure enclave access tokens.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  render: () => (
    <Tabs defaultValue="kernel" className="w-[500px]">
      <TabsList variant="cyber" className="grid w-full grid-cols-2 gap-2 h-12">
        <TabsTrigger variant="cyber" value="kernel" className="font-mono italic uppercase">
          <Terminal className="mr-2 size-4" /> // KERNEL
        </TabsTrigger>
        <TabsTrigger variant="cyber" value="buffer" className="font-mono italic uppercase">
          <Database className="mr-2 size-4" /> // BUFFER
        </TabsTrigger>
      </TabsList>
      <TabsContent value="kernel" className="mt-6">
        <div className="bg-black border border-cyan-500/20 p-8 rounded-xl font-mono text-[11px] text-cyan-400 space-y-2">
          <p className="font-bold">{'>'} INITIALIZING_BOOT_LOADER...</p>
          <p className="opacity-40 italic">-- loading virtual environment --</p>
          <p className="opacity-40 italic">-- synchronizing pulse clock --</p>
          <p className="pt-4 text-emerald-500">{'>'} SYSTEM_READY.</p>
        </div>
      </TabsContent>
      <TabsContent value="buffer" className="mt-6">
        <div className="bg-black border border-cyan-500/20 p-8 rounded-xl font-mono text-[11px] text-cyan-400 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="opacity-40">SECTOR_0x7F</span>
            <span className="text-emerald-500 font-black">STABLE</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="opacity-40">SECTOR_0x1A</span>
            <span className="text-emerald-500 font-black">STABLE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-40">SECTOR_0x9C</span>
            <span className="text-amber-500 font-black animate-pulse">DEGRADED</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric backgrounds.
 */
export const GlassAtmospheric: Story = {
  render: () => (
    <div className="p-40 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[4rem] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" />
      <Tabs defaultValue="stratosphere" className="w-[450px] relative z-10">
        <TabsList variant="glass" className="grid w-full grid-cols-2 rounded-full border-white/10 bg-white/5 backdrop-blur-2xl px-2 py-1.5 h-12">
          <TabsTrigger variant="glass" value="stratosphere" className="rounded-full text-white font-black uppercase tracking-widest text-[10px]">Stratosphere</TabsTrigger>
          <TabsTrigger variant="glass" value="exosphere" className="rounded-full text-white font-black uppercase tracking-widest text-[10px]">Exosphere</TabsTrigger>
        </TabsList>
        <TabsContent value="stratosphere" className="mt-8 text-center text-white">
          <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Middle_Layer</h3>
          <p className="text-white/60 text-sm leading-relaxed">Altitude: 12km - 50km. Primary ingestion zone for high-altitude telemetry data points.</p>
        </TabsContent>
        <TabsContent value="exosphere" className="mt-8 text-center text-white">
          <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Outer_Enclave</h3>
          <p className="text-white/60 text-sm leading-relaxed">Altitude: 10,000km+. Secure buffer synchronization zone for orbital node clusters.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

/**
 * High-fidelity circular dial variant for mobile-first atmospheric navigation.
 */
export const PhoneDial: Story = {
  render: () => (
    <div className="w-[600px] flex flex-col items-center">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-12">CLICK_AND_DRAG_TO_ROTATE_DIAL</p>
      <Tabs defaultValue="t1">
        <TabsList variant="phone">
          <TabsTrigger variant="phone" value="t1">
            <Globe size={24} className="text-primary" />
            <span className="text-[9px] font-black uppercase">Alpha</span>
          </TabsTrigger>
          <TabsTrigger variant="phone" value="t2">
            <Zap size={24} className="text-primary" />
            <span className="text-[9px] font-black uppercase">Beta</span>
          </TabsTrigger>
          <TabsTrigger variant="phone" value="t3">
            <Shield size={24} className="text-primary" />
            <span className="text-[9px] font-black uppercase">Gamma</span>
          </TabsTrigger>
          <TabsTrigger variant="phone" value="t4">
            <Activity size={24} className="text-primary" />
            <span className="text-[9px] font-black uppercase">Delta</span>
          </TabsTrigger>
          <TabsTrigger variant="phone" value="t5">
            <Database size={24} className="text-primary" />
            <span className="text-[9px] font-black uppercase">Epsilon</span>
          </TabsTrigger>
        </TabsList>
        <div className="text-center pt-8">
          <TabsContent value="t1" className="animate-in fade-in zoom-in duration-500">
            <h4 className="text-2xl font-black tracking-tighter uppercase mb-2">Alpha_Node_Sync</h4>
            <Badge variant="secondary">STABLE</Badge>
          </TabsContent>
          <TabsContent value="t2" className="animate-in fade-in zoom-in duration-500">
            <h4 className="text-2xl font-black tracking-tighter uppercase mb-2">Beta_Signal_Gain</h4>
            <Badge variant="outline">BOOSTING</Badge>
          </TabsContent>
          <TabsContent value="t3" className="animate-in fade-in zoom-in duration-500">
            <h4 className="text-2xl font-black tracking-tighter uppercase mb-2">Gamma_Enclave_Lock</h4>
            <Badge variant="cyber">SECURE</Badge>
          </TabsContent>
          <TabsContent value="t4" className="animate-in fade-in zoom-in duration-500">
            <h4 className="text-2xl font-black tracking-tighter uppercase mb-2">Delta_Pulse_Trace</h4>
            <Badge variant="outline" animated>LIVE</Badge>
          </TabsContent>
          <TabsContent value="t5" className="animate-in fade-in zoom-in duration-500">
            <h4 className="text-2xl font-black tracking-tighter uppercase mb-2">Epsilon_Storage_Init</h4>
            <Badge variant="secondary">READY</Badge>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ),
};
import { within, userEvent, expect } from '@storybook/test';

/**
 * Automated interaction test: click tab, verify correct panel active.
 */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm p-4">Account panel content</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm p-4">Password panel content</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Initially the account tab is active
    const accountTab = canvas.getByRole('tab', { name: /account/i });
    const passwordTab = canvas.getByRole('tab', { name: /password/i });
    await expect(accountTab).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByText('Account panel content')).toBeVisible();
    // Click Password tab
    await userEvent.click(passwordTab);
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    await expect(accountTab).toHaveAttribute('aria-selected', 'false');
    await expect(canvas.getByText('Password panel content')).toBeVisible();
  },
};
