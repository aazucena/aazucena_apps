import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HexagonCard,
  HexagonCardDescription,
  HexagonCardTitle,
} from '@aazucena/ui';
import { Shield, Zap, Activity, Globe } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Specialized layout component for achievement and certification modules.
 * - **Visuals:** Uses SVG `polygon` for the base shape to ensure resolution-independent geometry.
 * - **UX:** Features hover-triggered scale and shadow elevation for interactive depth.
 * - **Design:** Optimized for clustering in "Hive" or "Honeycomb" grid patterns.
 * - **Variants:** Supports `award` (warm) and `certification` (cool) visual themes.
 */
const meta = {
  title: 'Components/Data/HexagonCard',
  component: HexagonCard,
  subcomponents: { HexagonCardTitle, HexagonCardDescription } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A geometric card component for displaying awards, certifications, and technical achievements. Features an animated SVG background and custom icon support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['award', 'certification'],
      description: 'The visual theme and color palette',
      table: { category: 'Appearance' }
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'The physical dimensions of the hexagon',
      table: { category: 'Appearance' }
    },
    dashed: {
      control: 'boolean',
      description: 'Renders the border with a dashed stroke',
      table: { category: 'Behavior' }
    }
  },
} satisfies Meta<typeof HexagonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for professional awards.
 */
export const Award: Story = {
  args: {
    variant: 'award',
    size: 'default',
  },
  render: (args) => (
    <HexagonCard {...args}>
      <HexagonCardTitle>Best_Innovation</HexagonCardTitle>
      <HexagonCardDescription>Global_Engineering_2025</HexagonCardDescription>
    </HexagonCard>
  ),
};

/**
 * Technical implementation for cloud or system certifications.
 */
export const Certification: Story = {
  args: {
    variant: 'certification',
    size: 'default',
    icon: <Globe className="text-white" />,
  },
  render: (args) => (
    <HexagonCard {...args}>
      <HexagonCardTitle>Cloud_Architect</HexagonCardTitle>
      <HexagonCardDescription>Professional_AWS_Level</HexagonCardDescription>
    </HexagonCard>
  ),
};

/**
 * Demonstrates the use of custom icons and dashed borders for "In-Progress" states.
 */
export const InProgress: Story = {
  args: {
    variant: 'certification',
    dashed: true,
    icon: <Activity className="text-white animate-pulse" />,
  },
  render: (args) => (
    <HexagonCard {...args}>
      <HexagonCardTitle>Security_Expert</HexagonCardTitle>
      <HexagonCardDescription>Evaluation_Active</HexagonCardDescription>
    </HexagonCard>
  ),
};

/**
 * Comparison of the available size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <div className="text-center">
        <HexagonCard size="sm" variant="award">
          <HexagonCardTitle>SM_UNIT</HexagonCardTitle>
        </HexagonCard>
        <p className="mt-4 text-[10px] font-mono opacity-40">SM</p>
      </div>
      <div className="text-center">
        <HexagonCard size="default" variant="certification">
          <HexagonCardTitle>DF_UNIT</HexagonCardTitle>
        </HexagonCard>
        <p className="mt-4 text-[10px] font-mono opacity-40">DEFAULT</p>
      </div>
      <div className="text-center">
        <HexagonCard size="lg" variant="award">
          <HexagonCardTitle>LG_UNIT</HexagonCardTitle>
        </HexagonCard>
        <p className="mt-4 text-[10px] font-mono opacity-40">LG</p>
      </div>
    </div>
  ),
};

/**
 * Large format with specific technical icons.
 */
export const CyberAchievement: Story = {
  args: {
    variant: 'certification',
    size: 'lg',
    icon: <Shield className="size-10 text-white" />,
  },
  render: (args) => (
    <HexagonCard {...args}>
      <HexagonCardTitle className="text-xl">Enclave_Guardian</HexagonCardTitle>
      <HexagonCardDescription>Zero_Packet_Loss_Badge</HexagonCardDescription>
    </HexagonCard>
  ),
};
