import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl, SegmentedItem } from '@aazucena/ui';
import { useState } from 'react';
import { Activity, Database, Globe, Zap, Shield } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Tab-style selection primitive for toggling between related content views.
 * - **UX:** Features `active:scale-95` tactile feedback and smooth state transitions for the selection background.
 * - **Accessibility:** Built with standard `role="tablist"` and `aria-selected` attributes; supports keyboard navigation.
 * - **Variants:** Supports high-fidelity `glass` and `cyber` themes with specialized `active` indicator styles.
 */
const meta = {
  title: 'Components/Actions/SegmentedControl',
  component: SegmentedControl,
  subcomponents: { SegmentedItem } as any,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=20-66',
    },
    layout: 'centered',
    docs: {
      description: {
        component:
          'A linear set of two or more segments, each of which functions as a mutually exclusive button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme of the control container',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'radio',
      options: ['default', 'sm'],
      description: 'Physical dimensions and spacing',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a basic filter toggle.
 */
export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState('all');
    return (
      <SegmentedControl>
        <SegmentedItem value="all" isActive={value === 'all'} onClick={() => setValue('all')}>
          All_Nodes
        </SegmentedItem>
        <SegmentedItem
          value="active"
          isActive={value === 'active'}
          onClick={() => setValue('active')}
        >
          Active
        </SegmentedItem>
        <SegmentedItem
          value="pending"
          isActive={value === 'pending'}
          onClick={() => setValue('pending')}
        >
          Pending
        </SegmentedItem>
      </SegmentedControl>
    );
  },
};

/**
 * High-performance cyber variant with neon borders and mono typography.
 */
export const CyberTerminal: Story = {
  args: {
    variant: 'cyber',
  },
  render: (args) => {
    const [value, setValue] = useState('live');
    return (
      <div className="p-12 bg-background rounded-card border border-signal/10">
        <div className="flex flex-col items-center gap-6">
          <p className="text-[10px] font-mono text-signal/40 uppercase tracking-[0.4em]">
            Signal_Source_Override
          </p>
          <SegmentedControl {...args}>
            <SegmentedItem
              variant="cyber"
              value="live"
              isActive={value === 'live'}
              onClick={() => setValue('live')}
            >
              <Activity className="size-3 mr-2" /> LIVE_STREAM
            </SegmentedItem>
            <SegmentedItem
              variant="cyber"
              value="archive"
              isActive={value === 'archive'}
              onClick={() => setValue('archive')}
            >
              <Database className="size-3 mr-2" /> ARCHIVE_DATA
            </SegmentedItem>
          </SegmentedControl>
        </div>
      </div>
    );
  },
};

/**
 * Immersive glass variant, ideal for placement over animated atmospheric layers.
 */
export const GlassAtmospheric: Story = {
  args: {
    variant: 'glass',
  },
  render: (args) => {
    const [value, setValue] = useState('v1');
    return (
      <div className="p-20 rounded-card flex flex-col items-center gap-8">
        <SegmentedControl {...args} className="bg-state border-rule px-2 py-1.5">
          <SegmentedItem
            variant="glass"
            value="v1"
            isActive={value === 'v1'}
            onClick={() => setValue('v1')}
            className="px-8 text-foreground"
          >
            PHASE_01
          </SegmentedItem>
          <SegmentedItem
            variant="glass"
            value="v2"
            isActive={value === 'v2'}
            onClick={() => setValue('v2')}
            className="px-8 text-foreground"
          >
            PHASE_02
          </SegmentedItem>
        </SegmentedControl>
        <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em]">
          Atmospheric_Control
        </span>
      </div>
    );
  },
};

/**
 * High-density small variant, ideal for toolbars or sub-navigation.
 */
export const SmallDensity: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => {
    const [value, setValue] = useState('grid');
    return (
      <div className="flex items-center gap-4 border p-2 rounded-card bg-muted/20">
        <span className="text-[10px] font-bold uppercase opacity-40 ml-2">View:</span>
        <SegmentedControl {...args}>
          <SegmentedItem value="grid" isActive={value === 'grid'} onClick={() => setValue('grid')}>
            GRID
          </SegmentedItem>
          <SegmentedItem value="list" isActive={value === 'list'} onClick={() => setValue('list')}>
            LIST
          </SegmentedItem>
        </SegmentedControl>
      </div>
    );
  },
};
