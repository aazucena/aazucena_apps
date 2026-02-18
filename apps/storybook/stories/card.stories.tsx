import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { Badge } from '@aazucena/ui';
import { Play, Activity, Globe, Shield } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Layout container using atomic sub-components (Header, Content, Footer).
 * - **Architecture:** Uses CVA for 6 visual variants, 6 padding levels, and 6 radius presets.
 * - **Interactivity:** Features built-in `hover` and `clickable` states with tactile scale feedback.
 * - **Variants:** Aligned with atmospheric layers (`glass`, `cyber`) and specialized contexts (`dashboard`).
 */
const meta = {
  title: 'Components/Layout/Card',
  component: Card,
  subcomponents: {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile container for grouping related content and actions. Features standard ShadCN structure with enhanced high-fidelity variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'outline', 'ghost', 'dashboard'],
      description: 'Visual theme of the card',
      table: { category: 'Appearance' }
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Internal content spacing',
      table: { category: 'Layout' }
    },
    radius: {
      control: 'select',
      options: ['default', 'lg', 'xl', '2xl', '3xl', 'full'],
      description: 'Corner rounding preset',
      table: { category: 'Layout' }
    },
    hover: {
      control: 'boolean',
      description: 'Enable scale and shadow on hover',
      table: { category: 'Behavior' }
    },
    clickable: {
      control: 'boolean',
      description: 'Enable cursor-pointer and active-scale feedback',
      table: { category: 'Behavior' }
    }
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard card implementation with header and content.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    padding: 'none', // Sub-components handle their own padding
  },
  render: (args) => (
    <Card {...args} className="w-[400px]">
      <CardHeader>
        <CardTitle>Project_Alpha</CardTitle>
        <CardDescription>Core infrastructure module for real-time telemetry.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm opacity-80">This card demonstrates the standard composition of nested elements.</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Badge variant="outline">STABLE</Badge>
        <Button variant="ghost" size="sm">Details</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * High-performance cyber variant with neon accents and letter-spaced typography.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
    hover: true,
  },
  render: (args) => (
    <Card {...args} className="w-[400px]">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2 text-cyan-500">
          <Play size={14} />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">SYSTEM_INIT</span>
        </div>
        <CardTitle className="font-mono italic">// PROTOCOL_TRACE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-black/40 rounded border border-cyan-500/10 font-mono text-[10px] space-y-1">
          <p className="text-cyan-500/60">{'>'} INITIALIZING_UPLINK...</p>
          <p className="text-emerald-500/60">{'>'} UPLINK_SUCCESS [PORT:8080]</p>
          <p className="text-white/40">{'>'} LISTENING_FOR_PACKETS</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="cyber" size="sm" className="w-full">ENGAGE_UPLINK</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * Immersive glass variant with backdrop blur, ideal for floating overlays.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
    hover: true,
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem]">
      <Card {...args} className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-white">Atmospheric_Layer</CardTitle>
          <CardDescription className="text-white/60">Mesosphere configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-white/80">
            <Shield size={24} className="text-emerald-400" />
            <div className="text-xs font-medium">Encryption enabled across all dynamic routes.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Specialized variant for technical dashboards and analytics views.
 */
export const AnalyticsDashboard: Story = {
  args: {
    variant: 'dashboard',
    padding: 'lg',
  },
  render: (args) => (
    <Card {...args} className="w-[500px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-black tracking-tighter">NODE_TRAFFIC</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Global Ingestion Stream</p>
        </div>
        <Activity className="text-primary animate-pulse" />
      </div>
      <div className="h-32 flex items-end gap-1 mb-6">
        {[40, 70, 45, 90, 65, 80, 30, 50, 85, 60, 40, 75].map((h, i) => (
          <div key={i} className="flex-1 bg-primary/30 rounded-t-sm hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted/50 rounded-lg border">
          <p className="text-[10px] font-bold opacity-40 uppercase">Latency</p>
          <p className="text-xl font-black">12ms</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg border">
          <p className="text-[10px] font-bold opacity-40 uppercase">Success</p>
          <p className="text-xl font-black text-emerald-500">99.9%</p>
        </div>
      </div>
    </Card>
  ),
};

/**
 * Demonstrates the interactive states for clickable cards.
 */
export const Clickable: Story = {
  args: {
    clickable: true,
    hover: true,
    variant: 'outline',
    radius: '2xl',
  },
  render: (args) => (
    <Card {...args} className="w-[350px] group">
      <CardHeader>
        <CardTitle>Interact_Link</CardTitle>
        <CardDescription>Click to simulate navigation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
          <span className="text-xs font-black uppercase tracking-widest">GO_TO_RESOURCE</span>
          <Globe size={14} />
        </div>
      </CardContent>
    </Card>
  ),
};
