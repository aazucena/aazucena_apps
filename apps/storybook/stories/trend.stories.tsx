import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trend } from '@aazucena/ui';
import { Card, CardContent } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic primitive for visualizing directional shifts in quantitative data.
 * - **UX:** Features automated icon mapping (ArrowUp, ArrowDown, Activity) based on the `direction` state.
 * - **Aesthetics:** Uses high-contrast technical colors (Emerald, Rose, Zinc) with support for `pill` and `ghost` variants.
 * - **Design:** Optimized for high-density analytical dashboards and inline status readouts.
 */
const meta = {
  title: 'Components/Data/Trend',
  component: Trend,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A compact indicator used to show the direction and magnitude of change in a metric.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
      description: 'The semantic direction of the change',
      table: { category: 'State' }
    },
    variant: {
      control: 'select',
      options: ['default', 'pill', 'ghost'],
      description: 'The visual style of the indicator',
      table: { category: 'Appearance' }
    },
    value: {
      control: 'text',
      description: 'The numeric or text value to display',
      table: { category: 'Content' }
    },
    showIcon: {
      control: 'boolean',
      description: 'Toggle the directional icon',
      table: { category: 'Behavior' }
    }
  },
} satisfies Meta<typeof Trend>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a positive increase.
 */
export const Positive: Story = {
  args: {
    direction: 'up',
    value: '+12.5%',
    variant: 'default',
  },
};

/**
 * Standard implementation showing a negative decrease.
 */
export const Negative: Story = {
  args: {
    direction: 'down',
    value: '-2.4%',
    variant: 'default',
  },
};

/**
 * High-visibility pill variant, ideal for high-density dashboards.
 */
export const StatusPill: Story = {
  render: () => (
    <div className="flex gap-6">
      <Trend variant="pill" direction="up" value="+42.8%" />
      <Trend variant="pill" direction="down" value="-12.1%" />
      <Trend variant="pill" direction="neutral" value="STABLE" />
    </div>
  ),
};

/**
 * Demonstrates the trend indicator in its intended context (Stat Card).
 */
export const IntegratedContext: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 w-[500px]">
      <Card variant="outline" className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-black uppercase opacity-40">Uplink_Signal</span>
          <Trend variant="pill" direction="up" value="BOOST" />
        </div>
        <div className="text-3xl font-black tracking-tighter">85dBm</div>
      </Card>
      
      <Card variant="outline" className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-black uppercase opacity-40">Packet_Loss</span>
          <Trend variant="pill" direction="down" value="-0.4%" />
        </div>
        <div className="text-3xl font-black tracking-tighter text-emerald-500">0.02%</div>
      </Card>
    </div>
  ),
};

/**
 * Clean variant without icons, ideal for minimal text readouts.
 */
export const TextOnly: Story = {
  args: {
    value: 'Nominal',
    showIcon: false,
    direction: 'neutral',
  },
};
