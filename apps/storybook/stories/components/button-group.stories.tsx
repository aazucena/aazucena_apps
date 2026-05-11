import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroup, ButtonGroupItem, ButtonGroupSeparator, ButtonGroupText } from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { Layout, Globe, Activity, Plus, Minus } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite component for grouping related actions (Segments, Toolbars, Action pairs).
 * - **UX:** Automatically handles border-merging and corner-rounding for nested children.
 * - **Variants:** Supports `glass` and `cyber` container styles for consistent aesthetic depth.
 * - **Composition:** Works with standard `Button` components or specialized `ButtonGroupItem` for unique aesthetics.
 */
const meta = {
  title: 'Components/Actions/ButtonGroup',
  component: ButtonGroup,
  subcomponents: {
    ButtonGroupItem,
    ButtonGroupSeparator,
    ButtonGroupText,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A wrapper for clustering buttons together. Handles layout distribution, orientation, and visual unification of nested elements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'actions', 'inline', 'glass', 'cyber'],
      description: 'The visual grouping style',
      table: { category: 'Appearance' },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Layout flow of the group',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation using ShadCN Buttons. Note how borders are merged automatically.
 */
export const Basic: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline" size="sm">
        <Layout className="mr-2 h-3 w-3" /> Grid
      </Button>
      <Button variant="outline" size="sm">
        <Activity className="mr-2 h-3 w-3" /> List
      </Button>
      <Button variant="outline" size="sm">
        <Globe className="mr-2 h-3 w-3" /> Map
      </Button>
    </ButtonGroup>
  ),
};

/**
 * High-performance cyber variant with neon glow and specialized text segments.
 */
export const CyberToolbar: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText variant="cyber">NODE_01</ButtonGroupText>
      <ButtonGroupSeparator className="dark:bg-cyan-500/20" />
      <Button variant="ghost" size="icon" className="text-cyan-500 hover:bg-cyan-500/10">
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="text-cyan-500 hover:bg-cyan-500/10">
        <Minus className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Immersive glass variant, ideal for floating toolbars over animated layers.
 */
export const GlassSegments: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem]">
      <ButtonGroup {...args}>
        <Button variant="ghost" className="text-white hover:bg-white/10 px-6">
          ANALYTICS
        </Button>
        <ButtonGroupSeparator className="bg-white/10" />
        <Button variant="ghost" className="text-white hover:bg-white/10 px-6">
          TRAJECTORY
        </Button>
        <ButtonGroupSeparator className="bg-white/10" />
        <Button variant="ghost" className="text-white hover:bg-white/10 px-6">
          INTEL
        </Button>
      </ButtonGroup>
    </div>
  ),
};

/**
 * Used for primary action pairs at the bottom of sections or forms.
 */
export const ActionPair: Story = {
  args: {
    variant: 'actions',
  },
  render: (args) => (
    <div className="w-[600px] border border-dashed p-12 rounded-3xl">
      <ButtonGroup {...args}>
        <ButtonGroupItem variant="cta">INITIATE_SEQUENCE</ButtonGroupItem>
        <ButtonGroupItem variant="outline">ABORT_PROTOCOL</ButtonGroupItem>
      </ButtonGroup>
    </div>
  ),
};

/**
 * Vertical orientation for sidebars or property panels.
 */
export const VerticalGroup: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <ButtonGroup {...args} className="w-48">
      <Button variant="outline" className="justify-start">
        Profile Settings
      </Button>
      <Button variant="outline" className="justify-start">
        Security
      </Button>
      <Button variant="outline" className="justify-start">
        Uplink Status
      </Button>
    </ButtonGroup>
  ),
};
