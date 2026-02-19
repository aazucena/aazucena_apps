import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FilterBar,
  FilterBarActions,
  FilterBarGrid,
  FilterBarHeader,
  FilterBarItem,
  FilterBarSearch,
} from '@aazucena/ui';
import { Button, Badge, NativeSelect } from '@aazucena/ui';
import { Activity, Globe, Zap, Database, Refresh } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout component for managing complex archive and list filtering.
 * - **UX:** Features integrated search with automatic Label linking and a responsive grid system.
 * - **Aesthetics:** Aligned with site-wide themes (`glass`, `cyber`) for consistent technical depth.
 * - **Composition:** Modular parts (Header, Grid, Item, Search, Actions) for assembling tailored filter interfaces.
 */
const meta = {
  title: 'Components/Layout/FilterBar',
  component: FilterBar,
  subcomponents: {
    FilterBarHeader,
    FilterBarGrid,
    FilterBarItem,
    FilterBarSearch,
    FilterBarActions,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust search and filter interface designed for project archives, blog feeds, and telemetry logs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the filter container',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for project archives or blog feeds.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[1000px]">
      <FilterBar {...args}>
        <FilterBarHeader>Project_Archive_Filters</FilterBarHeader>
        <FilterBarGrid>
          <FilterBarItem>
            <FilterBarSearch label="Signal_Query" placeholder="Filter by tech or title..." />
          </FilterBarItem>
          <FilterBarItem>
            <label className="ml-2 block text-[10px] font-black tracking-widest uppercase opacity-40 mb-3">
              Domain_Sector
            </label>
            <NativeSelect className="rounded-2xl h-12">
              <option>All_Sectors</option>
              <option>Frontend_Engineering</option>
              <option>Intelligence_AI</option>
              <option>Cloud_Infrastructure</option>
            </NativeSelect>
          </FilterBarItem>
          <FilterBarItem>
            <label className="ml-2 block text-[10px] font-black tracking-widest uppercase opacity-40 mb-3">
              Sort_Order
            </label>
            <div className="flex gap-2">
              <Badge variant="default" className="cursor-pointer">
                LATEST
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                POPULAR
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                ALPHABETIC
              </Badge>
            </div>
          </FilterBarItem>
        </FilterBarGrid>
        <FilterBarActions>
          <Button variant="ghost" size="sm" className="gap-2">
            <Refresh size={14} /> Reset_All_Filters
          </Button>
        </FilterBarActions>
      </FilterBar>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[1000px]">
      <FilterBar {...args}>
        <FilterBarHeader>
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-cyan-500 animate-pulse" />
            <span>// NODE_QUERY_TERMINAL</span>
          </div>
        </FilterBarHeader>
        <FilterBarGrid className="lg:grid-cols-2">
          <FilterBarSearch label="IDENT_SEARCH" variant="cyber" placeholder="Enter sector ID..." />
          <FilterBarItem>
            <label className="ml-2 block font-mono text-[10px] text-cyan-500/60 uppercase mb-3">
              PROTOCOL_LEVEL
            </label>
            <div className="flex gap-4">
              <Badge variant="cyber">CORE_NOMINAL</Badge>
              <Badge
                variant="outline"
                className="text-cyan-500/40 border-cyan-500/10 uppercase tracking-tighter"
              >
                Legacy_Buffer
              </Badge>
            </div>
          </FilterBarItem>
        </FilterBarGrid>
      </FilterBar>
    </div>
  ),
};

/**
 * Immersive glass variant, ideal for placement over complex visual backgrounds.
 */
export const GlassOverlay: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 rounded-[3rem]">
      <FilterBar {...args} className="w-[800px] border-white/10">
        <FilterBarHeader className="text-white/60">LAYER_COORDINATES</FilterBarHeader>
        <FilterBarGrid className="md:grid-cols-2">
          <FilterBarSearch
            label="Vector_Search"
            placeholder="Search spatial data..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
          <FilterBarItem>
            <label className="ml-2 block text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">
              Visibility_Range
            </label>
            <div className="flex gap-3">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                NEAR
              </Badge>
              <Badge variant="default" className="bg-white text-black hover:bg-white/90">
                ORBITAL
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                DEEP_SPACE
              </Badge>
            </div>
          </FilterBarItem>
        </FilterBarGrid>
      </FilterBar>
    </div>
  ),
};
