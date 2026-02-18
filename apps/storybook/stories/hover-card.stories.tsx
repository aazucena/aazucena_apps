import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@aazucena/ui';
import { Button, Avatar, AvatarImage, AvatarFallback, Badge } from '@aazucena/ui';
import { Calendar, Shield, Activity, Globe } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI primitive for secondary informational overlays.
 * - **UX:** Features smooth `fade-in` and `zoom-in` animations with configurable side offsets.
 * - **Accessibility:** Uses standard ARIA attributes for managing visibility; non-interactive trigger by default.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes.
 */
const meta = {
  title: 'Components/Primitives/HoverCard',
  component: HoverCard,
  subcomponents: { HoverCardTrigger, HoverCardContent } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'For sighted users to preview content available behind a link or button without navigating.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    openDelay: {
      control: 'number',
      description: 'The duration from when the mouse enters the trigger until the hover card opens.',
      table: { category: 'Behavior', defaultValue: { summary: '700' } }
    },
    closeDelay: {
      control: 'number',
      description: 'The duration from when the mouse leaves the trigger or content until the hover card closes.',
      table: { category: 'Behavior', defaultValue: { summary: '300' } }
    }
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing user or entity previews.
 */
export const Basic: Story = {
  render: () => (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="link" className="font-bold">@aazucena</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-6 rounded-2xl shadow-2xl">
        <div className="flex justify-between space-x-4">
          <Avatar className="size-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-black tracking-tighter uppercase">Aldrin Azucena</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Engineering Lead focusing on high-fidelity design systems and decentralized telemetry.
            </p>
            <div className="flex items-center pt-2 gap-2 opacity-40">
              <Calendar className="size-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Joined FEB 2026</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/**
 * High-performance cyber variant with neon borders and technical context.
 */
export const CyberSpec: Story = {
  render: () => (
    <HoverCard openDelay={100}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 cursor-help border-b border-dashed border-cyan-500/40 pb-0.5">
          <Activity size={14} className="text-cyan-500" />
          <span className="font-mono text-xs text-cyan-400">NODE_0x7F42</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent variant="cyber" side="top" className="w-72 font-mono p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="text-[10px] text-cyan-500 font-black uppercase italic tracking-tighter">// IDENT_DECRYPTED</div>
            <Badge variant="cyber" size="xs">ACTIVE</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-white uppercase">Primary_Uplink_Core</p>
            <p className="text-[10px] opacity-40 uppercase">ZONE: US_EAST_1</p>
          </div>
          <div className="pt-2 border-t border-cyan-500/10 flex justify-between text-[9px] opacity-60 uppercase">
            <span>Latency</span>
            <span className="text-cyan-400">12ms</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

/**
 * Immersive glass variant, ideal for atmospheric or gradient-heavy UI layers.
 */
export const GlassPreview: Story = {
  render: () => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 to-blue-800 rounded-[3rem]">
      <HoverCard openDelay={100}>
        <HoverCardTrigger asChild>
          <Button variant="glass" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-full">
            Inspect_Layer
          </Button>
        </HoverCardTrigger>
        <HoverCardContent variant="glass" className="w-80 border-white/10 text-white">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="size-4 opacity-60" />
              <h4 className="font-black uppercase tracking-tighter">Atmospheric_Unit</h4>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Real-time environmental monitoring with adaptive frosted surfaces and backdrop blur enabled.
            </p>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">SIGNAL_LOCK</span>
              <div className="text-emerald-400 font-mono text-xs mt-1">99.98% STABLE</div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
