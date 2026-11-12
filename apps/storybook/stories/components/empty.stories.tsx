import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@aazucena/ui';
import { Database, Search, Activity, Sparkles, Globe } from '@aazucena/icons';
import { Button, Badge } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite "Empty State" layout for non-ideal states (No results, Empty archives, Initial onboarding).
 * - **UX:** Features centered, high-contrast typography with built-in maximum width constraints for readability.
 * - **Variants:** Supports `default`, `archive` (expanded), and `fullscreen` layouts.
 * - **Media:** Integrated `EmptyMedia` subcomponent handles icons, branded containers, and animations.
 */
const meta = {
  title: 'Components/Layout/Empty',
  component: Empty,
  subcomponents: {
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
    EmptyMedia,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile empty state component used when content is unavailable. Includes built-in support for icons, titles, descriptions, and action groups.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'archive', 'fullscreen'],
      description: 'The layout preset for the empty state',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for search results or filtered lists.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[500px]">
      <Empty {...args}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Search />
          </EmptyMedia>
          <EmptyTitle>No_Matches_Found</EmptyTitle>
          <EmptyDescription>
            We couldn't find any nodes matching your current filter criteria.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" className="rounded-full px-8">
            Clear_Filters
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  ),
};

/**
 * High-performance branded variant for empty repositories or archives.
 */
export const BrandedArchive: Story = {
  args: {
    variant: 'archive',
  },
  render: (args) => (
    <div className="w-[600px] border border-dashed p-12 rounded-card bg-muted/5">
      <Empty {...args}>
        <EmptyMedia variant="branded" className="bg-primary/5 border-primary/20 text-primary">
          <Database size={32} />
        </EmptyMedia>
        <EmptyTitle size="lg" className="font-black tracking-tighter">
          DATA_BUFFER_EMPTY
        </EmptyTitle>
        <EmptyDescription className="max-w-sm">
          Node US_EAST_1 has reported zero active trajectories for this window. Please initialize a
          new sync sequence.
        </EmptyDescription>
        <EmptyContent className="mt-8 flex flex-row gap-4">
          <Button variant="cyber" size="sm">
            INIT_SYNC
          </Button>
          <Button variant="outline" size="sm">
            CHECK_HEALTH
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  ),
};

/**
 * Specialized technical empty state for live feeds or telemetry streams.
 */
export const SignalLost: Story = {
  render: () => (
    <div className="w-[500px]">
      <Empty>
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-alert/20 blur-2xl animate-pulse rounded-full" />
          <EmptyMedia
            variant="icon"
            className="bg-alert/10 border-alert/30 text-alert size-16 rounded-full relative z-10"
          >
            <Activity size={32} />
          </EmptyMedia>
        </div>
        <EmptyTitle className="text-alert font-mono italic">// SIGNAL_INTERRUPTED</EmptyTitle>
        <EmptyDescription className="font-mono text-[10px] opacity-60">
          UPLINK_STATUS: DISCONNECTED // ERROR_CODE: 0x7F42
        </EmptyDescription>
        <EmptyContent className="mt-6">
          <Badge variant="outline" animated>
            RETRYING_CONNECTION...
          </Badge>
        </EmptyContent>
      </Empty>
    </div>
  ),
};

/**
 * Large format empty state for entire page views.
 */
export const Fullscreen: Story = {
  args: {
    variant: 'fullscreen',
  },
  render: (args) => (
    <div className="w-[800px] h-[500px] border rounded-card flex items-center justify-center bg-background text-foreground overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.3)_0%,transparent_70%)]" />
      <Empty {...args} className="relative z-10">
        <EmptyMedia className="mb-12">
          <Sparkles className="size-16 text-signal animate-pulse" />
        </EmptyMedia>
        <EmptyTitle size="lg" className="text-4xl">
          Welcome_to_Intelligence
        </EmptyTitle>
        <EmptyDescription className="text-foreground/60 text-base mt-4 max-w-md">
          Start by connecting your first edge node to visualize real-time trajectory flows.
        </EmptyDescription>
        <EmptyContent className="mt-12">
          <Button className="h-14 px-12 rounded-full bg-signal text-foreground hover:bg-signal font-black uppercase tracking-widest">
            Connect_Node <Globe className="ml-2 size-5" />
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  ),
};
