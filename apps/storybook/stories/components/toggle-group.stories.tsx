import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleGroup, ToggleGroupItem } from '@aazucena/ui';
import {
  Layout,
  Globe,
  Activity,
  TypeBold as Bold,
  TypeItalic as Italic,
  TypeUnderline as Underline,
  Database,
  Shield,
  Zap,
} from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite layout suite for managing multiple related toggles (Selection groups, Toolbars).
 * - **Accessibility:** Fully keyboard navigable; supports `single` and `multiple` selection modes with proper ARIA attributes.
 * - **UX:** Automatically synchronizes `variant` and `size` props from the parent group to all items.
 * - **Architecture:** Built on Radix UI `ToggleGroup` for robust state management and focus delegation.
 */
const meta = {
  title: 'Components/Actions/ToggleGroup',
  component: ToggleGroup,
  subcomponents: { ToggleGroupItem },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A set of two-state buttons that can be toggled on or off, functioning as either a single or multiple selection group.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'Selection mode',
      table: { category: 'Behavior' },
    },
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'The visual style of the items',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'radio',
      options: ['sm', 'default', 'lg'],
      description: 'Physical dimensions',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a multi-select toolbar.
 */
export const MultiSelect: Story = {
  args: {
    type: 'multiple',
    variant: 'outline',
  },
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">View_Filters</p>
      <ToggleGroup type={args.type} {...args}>
        <ToggleGroupItem value="grid" aria-label="Toggle grid">
          <Layout />
        </ToggleGroupItem>
        <ToggleGroupItem value="map" aria-label="Toggle map">
          <Globe />
        </ToggleGroupItem>
        <ToggleGroupItem value="live" aria-label="Toggle live">
          <Activity />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

/**
 * High-performance technical variant for selecting active node sectors.
 */
export const CyberTerminal: Story = {
  args: {
    type: 'single',
    variant: 'outline',
  },
  render: (args) => (
    <div className="p-10 bg-black border border-cyan-500/10 rounded-2xl flex flex-col items-center gap-8">
      <div className="flex items-center gap-3">
        <Database size={16} className="text-cyan-500 animate-pulse" />
        <span className="font-mono text-xs text-cyan-500 uppercase tracking-tighter italic">
          // SELECT_ACTIVE_SECTOR
        </span>
      </div>
      <ToggleGroup {...args} className="gap-2">
        <ToggleGroupItem
          value="s1"
          className="h-12 w-16 border-cyan-500/30 text-cyan-500 data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400 data-[state=on]:border-cyan-400"
        >
          0x7F
        </ToggleGroupItem>
        <ToggleGroupItem
          value="s2"
          className="h-12 w-16 border-cyan-500/30 text-cyan-500 data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400 data-[state=on]:border-cyan-400"
        >
          0x1A
        </ToggleGroupItem>
        <ToggleGroupItem
          value="s3"
          className="h-12 w-16 border-cyan-500/30 text-cyan-500 data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400 data-[state=on]:border-cyan-400"
        >
          0x9C
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

/**
 * Standard text formatting group implementation.
 */
export const TypographyTools: Story = {
  args: {
    type: 'multiple',
    variant: 'outline',
  },
  render: () => (
    <ToggleGroup
      type="multiple"
      variant="outline"
      className="border p-1 rounded-xl bg-card shadow-sm"
    >
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/**
 * Demonstrates the range of available size presets.
 */
export const Sizes: Story = {
  args: {
    type: 'single',
    variant: 'outline',
  },
  render: () => (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <ToggleGroup type="single" size="sm" variant="outline">
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-[9px] font-mono opacity-40 uppercase">SM</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ToggleGroup type="single" size="default" variant="outline">
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-[9px] font-mono opacity-40 uppercase">DEFAULT</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ToggleGroup type="single" size="lg" variant="outline">
          <ToggleGroupItem value="1">1</ToggleGroupItem>
          <ToggleGroupItem value="2">2</ToggleGroupItem>
          <ToggleGroupItem value="3">3</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-[9px] font-mono opacity-40 uppercase">LG</p>
      </div>
    </div>
  ),
};
