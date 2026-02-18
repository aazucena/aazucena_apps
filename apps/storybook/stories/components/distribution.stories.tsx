import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Distribution,
  DistributionBar,
  DistributionGroup,
  DistributionHeader,
  DistributionList,
  DistributionTag,
} from '@aazucena/ui';
import { Globe, Code, Shield, Activity, Zap } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout component for visual quantitative data (Skill levels, Traffic stats).
 * - **UX:** Features integrated progress bars with custom gradient support and category icons.
 * - **Design:** Optimized for high-density information displays with weighted tag clustering.
 * - **Variants:** Supports standard `emphasis` and high-fidelity `cyber` styles.
 * - **Composition:** Modular parts (Bar, Tag, Group) for flexible data narratives.
 */
const meta = {
  title: 'Components/Data/Distribution',
  component: Distribution,
  subcomponents: {
    DistributionHeader,
    DistributionList,
    DistributionBar,
    DistributionGroup,
    DistributionTag,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A data visualization suite for displaying relative proportions and clustered tags. Ideal for project metadata and skill profiling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cyber'],
      description: 'The visual theme of the distribution suite',
      table: { category: 'Appearance' }
    }
  },
} satisfies Meta<typeof Distribution>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a mix of bar metrics and tag clusters.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[500px] p-8 border rounded-[2rem] bg-card shadow-2xl">
      <Distribution {...args}>
        <DistributionGroup>
          <DistributionHeader>Regional_Intelligence_Metrics</DistributionHeader>
          <DistributionList>
            <DistributionBar value={45} label="North America" icon={<Globe />} color="from-blue-500 to-indigo-600" />
            <DistributionBar value={30} label="European Union" icon={<Globe />} color="from-emerald-500 to-teal-600" />
            <DistributionBar value={25} label="APAC Region" icon={<Globe />} color="from-orange-500 to-rose-600" />
          </DistributionList>
        </DistributionGroup>

        <DistributionGroup>
          <DistributionHeader>Domain_Expertise_Tags</DistributionHeader>
          <div className="flex flex-wrap gap-2">
            <DistributionTag weight="emphasis">Frontend_Core</DistributionTag>
            <DistributionTag weight="emphasis">3D_Graphics</DistributionTag>
            <DistributionTag>Machine_Learning</DistributionTag>
            <DistributionTag>Cloud_Native</DistributionTag>
            <DistributionTag weight="emphasis">Observability</DistributionTag>
          </div>
        </DistributionGroup>
      </Distribution>
    </div>
  ),
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <div className="w-[500px] p-8 border border-cyan-500/20 bg-black rounded-xl">
      <Distribution {...args}>
        <DistributionGroup>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="size-4 text-cyan-500 animate-pulse" />
            <DistributionHeader className="mb-0 text-cyan-500 opacity-60">SYSTEM_SECURITY_DISTRIBUTION</DistributionHeader>
          </div>
          <DistributionList>
            <DistributionBar variant="cyber" value={98} label="ENCRYPTION_STRENGTH" icon={<Shield />} color="from-cyan-500 to-blue-600" />
            <DistributionBar variant="cyber" value={12} label="THREAT_VECTOR_COUNT" icon={<Code />} color="from-rose-500 to-red-600" />
          </DistributionList>
        </DistributionGroup>
        
        <div className="flex flex-wrap gap-3 pt-4">
          <DistributionTag weight="cyber">CORE_ACTIVE</DistributionTag>
          <DistributionTag weight="cyber">UPLINK_STABLE</DistributionTag>
          <DistributionTag weight="cyber">ENCLAVE_LOCKED</DistributionTag>
        </div>
      </Distribution>
    </div>
  ),
};

/**
 * Focuses on bar metrics, ideal for project performance or resource usage.
 */
export const PerformanceMetrics: Story = {
  render: () => (
    <div className="w-[450px]">
      <Distribution>
        <DistributionGroup>
          <DistributionHeader>Resource_Allocation</DistributionHeader>
          <DistributionList className="space-y-6">
            <DistributionBar value={12} label="CPU_Cycle_Load" icon={<Activity />} color="from-zinc-500 to-zinc-700" />
            <DistributionBar value={85} label="Memory_Cache_Util" icon={<Database />} color="from-blue-400 to-blue-600" />
            <DistributionBar value={42} label="Network_Bandwidth" icon={<Zap />} color="from-emerald-400 to-emerald-600" />
          </DistributionList>
        </DistributionGroup>
      </Distribution>
    </div>
  ),
};

/**
 * Demonstrates the weight-based visual hierarchy for tag clouds.
 */
export const WeightedTags: Story = {
  render: () => (
    <div className="w-[400px] text-center">
      <DistributionHeader>CLUSTERING_HIERARCHY</DistributionHeader>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <DistributionTag weight="emphasis">PRIMARY_NODE</DistributionTag>
        <DistributionTag weight="emphasis">CORE_SIGNAL</DistributionTag>
        <DistributionTag>Secondary_Tracer</DistributionTag>
        <DistributionTag>Legacy_Buffer</DistributionTag>
        <DistributionTag weight="emphasis">UPLINK_SYNC</DistributionTag>
        <DistributionTag>Aux_Relay</DistributionTag>
      </div>
    </div>
  ),
};
