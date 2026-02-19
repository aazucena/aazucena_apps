import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResponsiveGrid } from '@aazucena/ui';
import { Card, CardContent } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Layout primitive for managing multi-column content distribution.
 * - **Responsiveness:** Automatically calculates column spans across standard breakpoints (sm, md, lg).
 * - **Design:** Optimized for consistent horizontal spacing using a standard gap scale (xs to xl).
 * - **UX:** Features smooth `duration-500` transitions for dynamic layout shifts.
 */
const meta = {
  title: 'Components/Layout/ResponsiveGrid',
  component: ResponsiveGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust grid system that automatically manages column spans and gaps based on the viewport size.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cols: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Maximum columns at the largest breakpoint',
      table: { category: 'Layout' },
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The space between grid items',
      table: { category: 'Layout' },
    },
    variant: {
      control: 'select',
      options: ['default', 'archive'],
      description: 'Visual layout variation',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof ResponsiveGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation showing a 3-column distribution.
 */
export const Basic: Story = {
  args: {
    cols: 3,
    gap: 'md',
  },
  render: (args) => (
    <div className="w-[800px]">
      <ResponsiveGrid {...args}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} variant="outline" className="h-32 flex items-center justify-center">
            <span className="text-xs font-black opacity-20">UNIT_0{i + 1}</span>
          </Card>
        ))}
      </ResponsiveGrid>
    </div>
  ),
};

/**
 * High-density implementation, ideal for icon grids or small metadata cards.
 */
export const DenseGrid: Story = {
  args: {
    cols: 6,
    gap: 'sm',
  },
  render: (args) => (
    <div className="w-[1000px]">
      <ResponsiveGrid {...args}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted/30 border-2 border-dashed rounded-xl flex items-center justify-center"
          >
            <div className="size-2 rounded-full bg-primary/20" />
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  ),
};

/**
 * Demonstrates large spacing for major content sections.
 */
export const HeroGrid: Story = {
  args: {
    cols: 2,
    gap: 'xl',
  },
  render: (args) => (
    <div className="w-[800px]">
      <ResponsiveGrid {...args}>
        <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] border p-8">
          <h3 className="text-xl font-black uppercase tracking-tighter">Primary_Sector</h3>
        </div>
        <div className="h-64 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-[2rem] border p-8">
          <h3 className="text-xl font-black uppercase tracking-tighter">Secondary_Buffer</h3>
        </div>
      </ResponsiveGrid>
    </div>
  ),
};

/**
 * Demonstrates the transition between column counts.
 */
export const AdaptiveColumns: Story = {
  args: {
    cols: 4,
    gap: 'md',
  },
  render: (args) => (
    <div className="w-[900px] border border-dashed p-8 rounded-[3rem]">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-8 text-center">
        Breakpoints: SM(2) // MD(3) // LG(4)
      </p>
      <ResponsiveGrid {...args}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} hover className="h-24">
            <CardContent className="h-full flex items-center justify-center p-0">
              <span className="font-mono text-[10px]">0x7F_{i}</span>
            </CardContent>
          </Card>
        ))}
      </ResponsiveGrid>
    </div>
  ),
};
