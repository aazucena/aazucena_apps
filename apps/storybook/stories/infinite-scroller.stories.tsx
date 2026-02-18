import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfiniteScroller } from '@aazucena/ui';
import { Card, CardContent } from '@aazucena/ui';
import { Badge } from '@aazucena/ui';
import { Activity, Database, Globe, Shield, Zap, Code, Terminal, Microchip as Cpu } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** CSS-driven infinite marquee primitive for marquee lists and tech stack displays.
 * - **UX:** Features seamless duplication logic for perfect looping and `pauseOnHover` interaction.
 * - **Aesthetics:** Uses `mask-image` for soft horizontal fading by default.
 * - **Optimization:** Avoids JS-based position updating; purely uses CSS transforms for high-frame-rate performance.
 */
const meta = {
  title: 'Components/Primitives/InfiniteScroller',
  component: InfiniteScroller,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A performant infinite scrolling container for lists of logos, badges, or cards. Pure CSS implementation for maximum efficiency.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'full'],
      description: 'Default includes horizontal fading masks',
      table: { category: 'Appearance' }
    },
    speed: {
      control: 'select',
      options: ['fast', 'normal', 'slow'],
      description: 'Animation duration preset',
      table: { category: 'Behavior' }
    },
    direction: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'The scroll axis',
      table: { category: 'Behavior' }
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Stop animation when user interacts',
      table: { category: 'Behavior' }
    }
  },
} satisfies Meta<typeof InfiniteScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

const techItems = [
  { name: 'TypeScript', icon: Code, color: 'text-blue-500' },
  { name: 'React', icon: Activity, color: 'text-cyan-500' },
  { name: 'Next.js', icon: Globe, color: 'text-white' },
  { name: 'PostgreSQL', icon: Database, color: 'text-indigo-500' },
  { name: 'Tailwind', icon: Zap, color: 'text-sky-400' },
  { name: 'Three.js', icon: Globe, color: 'text-emerald-500' },
  { name: 'Node.js', icon: Cpu, color: 'text-green-500' },
  { name: 'Zod', icon: Shield, color: 'text-amber-500' },
];

// --- STORIES ---

/**
 * Standard implementation showing a technical stack marquee.
 */
export const Basic: Story = {
  args: {
    speed: 'normal',
    direction: 'left',
  },
  render: (args) => (
    <div className="w-[800px] border border-dashed rounded-3xl p-4 bg-muted/5">
      <InfiniteScroller {...args}>
        {techItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 py-3 rounded-xl border bg-card shadow-sm whitespace-nowrap">
            <item.icon className={cn("size-4", item.color)} />
            <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
          </div>
        ))}
      </InfiniteScroller>
    </div>
  ),
};

/**
 * High-speed variant, ideal for rapid status feeds or ticker tapes.
 */
export const FastTicker: Story = {
  args: {
    speed: 'fast',
    variant: 'full',
  },
  render: (args) => (
    <div className="w-full bg-black py-2 border-y border-white/5">
      <InfiniteScroller {...args}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 text-white font-mono text-[10px] tracking-tighter opacity-40">
            <span>// UPLINK_NODE_{i}</span>
            <span className="text-emerald-500">STABLE</span>
            <span className="opacity-20">|</span>
          </div>
        ))}
      </InfiniteScroller>
    </div>
  ),
};

/**
 * Large format scrolling cards, useful for testimonials or project highlights.
 */
export const CardScroller: Story = {
  args: {
    speed: 'slow',
    direction: 'right',
  },
  render: (args) => (
    <div className="w-[1000px]">
      <InfiniteScroller {...args}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} variant="cyber" className="w-64 h-40 shrink-0">
            <CardContent className="pt-6 flex flex-col justify-between h-full">
              <p className="text-xs italic opacity-60 font-mono">"The neural telemetry engine is reporting optimal pulse intervals."</p>
              <div className="flex justify-between items-center">
                <Badge variant="outline" size="xs">AGENT_0{i + 1}</Badge>
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </InfiniteScroller>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placing on top of animated layers.
 */
export const GlassAtmosphere: Story = {
  args: {
    variant: 'default',
    speed: 'slow',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 to-purple-800 rounded-[3rem] w-[800px]">
      <InfiniteScroller {...args}>
        {['TROPOSPHERE', 'STRATOSPHERE', 'MESOSPHERE', 'THERMOSPHERE', 'EXOSPHERE'].map((layer, i) => (
          <div key={i} className="px-8 py-4 glass border-white/10 rounded-full text-white font-black text-xs tracking-[0.3em]">
            {layer}
          </div>
        ))}
      </InfiniteScroller>
    </div>
  ),
};

// Helper for stories
const cn = (...args: any[]) => args.filter(Boolean).join(' ');
