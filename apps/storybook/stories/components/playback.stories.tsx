import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Playback,
  PlaybackActions,
  PlaybackButton,
  PlaybackControls,
  PlaybackCounter,
} from '@aazucena/ui';
import { ChevronLeft, ChevronRight, Pause, Play, CogFour as Cog, Refresh, Activity, Globe } from '@aazucena/icons';
import { Button, Badge } from '@aazucena/ui';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Layout suite for temporal data control (Trajectory playback, System logs, Audio).
 * - **UX:** Features specialized counters with zero-padding and state-aware primary action buttons.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) with support for technical status indicators.
 * - **Composition:** Fully modular parts (Counter, Controls, Actions) for flexible sequential navigation.
 */
const meta = {
  title: 'Components/Actions/Playback',
  component: Playback,
  subcomponents: {
    PlaybackCounter,
    PlaybackControls,
    PlaybackButton,
    PlaybackActions,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A playback control bar for navigating sequential data or temporal streams. Optimized for analytical terminals and technical walkthroughs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the control bar',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof Playback>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for navigating a sequence of steps or logs.
 */
export const Basic: Story = {
  render: () => {
    const [current, setCurrent] = useState(12);
    return (
      <div className="w-[800px] border rounded-xl overflow-hidden shadow-2xl">
        <Playback>
          <PlaybackCounter current={current} total={45} />
          <PlaybackControls>
            <PlaybackButton onClick={() => setCurrent(Math.max(0, current - 1))}><ChevronLeft /></PlaybackButton>
            <PlaybackButton active><Pause /></PlaybackButton>
            <PlaybackButton onClick={() => setCurrent(Math.min(45, current + 1))}><ChevronRight /></PlaybackButton>
          </PlaybackControls>
          <PlaybackActions>
            <div className="flex items-center gap-2 mr-4">
              <Activity size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase opacity-40">Uplink_Active</span>
            </div>
            <Button variant="ghost" size="icon" className="size-8"><Refresh size={14}/></Button>
            <Button variant="ghost" size="icon" className="size-8"><Cog size={14}/></Button>
          </PlaybackActions>
        </Playback>
        <div className="h-40 bg-muted/10 flex items-center justify-center italic text-xs opacity-20 uppercase tracking-widest">
          Content_Sequence_Stage
        </div>
      </div>
    );
  }
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[800px] bg-black border border-cyan-500/10 rounded-2xl overflow-hidden">
      <Playback {...args}>
        <PlaybackCounter current={1} total={10} className="text-cyan-400" />
        <PlaybackControls>
          <PlaybackButton variant="cyber"><Play size={16} /></PlaybackButton>
        </PlaybackControls>
        <div className="ml-4 font-mono text-[10px] text-cyan-500/60 uppercase animate-pulse tracking-widest flex-1">
          AWAITING_ROOT_ACCESS_
        </div>
        <PlaybackActions>
          <Badge variant="cyber" size="xs">NODE_0x7F</Badge>
        </PlaybackActions>
      </Playback>
      <div className="h-32 bg-cyan-500/5 p-8 flex flex-col justify-center">
        <div className="h-1 w-full bg-cyan-500/10 rounded-full overflow-hidden">
          <div className="h-full w-1/10 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for floating overlays on top of animated layers.
 */
export const GlassMonitor: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem] relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 w-[700px]">
        <Playback {...args} className="border-white/10 rounded-t-2xl">
          <PlaybackCounter current={42} total={100} className="text-white" />
          <PlaybackControls>
            <PlaybackButton className="text-white hover:bg-white/10"><ChevronLeft /></PlaybackButton>
            <PlaybackButton active className="bg-white text-black hover:bg-white/90"><Play /></PlaybackButton>
            <PlaybackButton className="text-white hover:bg-white/10"><ChevronRight /></PlaybackButton>
          </PlaybackControls>
          <PlaybackActions>
            <Badge variant="outline" className="text-white border-white/20">LIVE_TRACK</Badge>
          </PlaybackActions>
        </Playback>
        <div className="h-32 glass border-white/10 border-t-0 rounded-b-2xl flex items-center justify-center">
          <Globe className="text-white/20 animate-spin-slow size-12" />
        </div>
      </div>
    </div>
  ),
};
