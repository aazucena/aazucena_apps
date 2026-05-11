import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid, GridItem, AutoGrid } from '@aazucena/layouts';

/**
 * ## Grid + GridItem + AutoGrid
 *
 * Three complementary grid primitives from `@aazucena/layouts`:
 *
 * | Component | Use when… |
 * |-----------|-----------|
 * | `Grid` + `GridItem` | You need explicit `col-span-n` control per child (named columns) |
 * | `AutoGrid` | You want the browser to decide column count from available space |
 *
 * **Important:** All column-span classes use static lookup maps — never template literals
 * (e.g. `` `col-span-${n}` ``). Tailwind's JIT purges dynamically constructed class strings
 * because it performs static analysis at build time.
 */
const meta = {
  title: 'Layouts/Grid',
  component: Grid,
  subcomponents: { GridItem, AutoGrid } as any,
  parameters: {
    docs: {
      description: {
        component:
          'A 12-column named grid (Grid + GridItem) plus an auto-fill/auto-fit grid (AutoGrid). Use Grid for explicit layout control; use AutoGrid for responsive card grids.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cols: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 12],
      description: 'Number of columns (static, not responsive)',
      table: { category: 'Grid' },
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between grid cells',
      table: { category: 'Grid' },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Colored placeholder cells — explicit colors so they're always visible regardless of theme
const Cell = ({
  label,
  color = 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  className = '',
}: {
  label: string;
  color?: string;
  className?: string;
}) => (
  <div
    className={`bg-gradient-to-br ${color} border rounded-xl flex items-center justify-center py-6 ${className}`}
  >
    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
      {label}
    </span>
  </div>
);

const COLORS = [
  'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'from-violet-500/20 to-purple-500/20 border-violet-500/30',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  'from-rose-500/20 to-pink-500/20 border-rose-500/30',
  'from-sky-500/20 to-indigo-500/20 border-sky-500/30',
];

// ---------------------------------------------------------------------------
// Grid + GridItem stories
// ---------------------------------------------------------------------------

/**
 * Full 12-column grid with each `GridItem` taking one column.
 */
export const TwelveColumn: Story = {
  render: () => (
    <Grid cols={12} gap="sm">
      {Array.from({ length: 12 }).map((_, i) => (
        <GridItem key={i} span={1}>
          <Cell label={`${i + 1}`} color={COLORS[i % COLORS.length]} />
        </GridItem>
      ))}
    </Grid>
  ),
};

/**
 * Responsive spans: full-width on mobile, halves on md, thirds on lg.
 */
export const ResponsiveSpans: Story = {
  render: () => (
    <Grid cols={12} gap="md">
      {COLORS.map((color, i) => (
        <GridItem key={i} span={12} md={6} lg={4}>
          <Cell label={`span=12 | md:6 | lg:4`} color={color} />
        </GridItem>
      ))}
    </Grid>
  ),
};

/**
 * Asymmetric 8/4 split — primary content + narrow sidebar.
 */
export const AsymmetricLayout: Story = {
  render: () => (
    <Grid cols={12} gap="lg">
      <GridItem span={12} md={8}>
        <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-6 min-h-[200px] flex flex-col gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Main Content — span=12 / md:8
          </span>
          <div className="flex-1 space-y-2">
            {[100, 90, 75].map((w) => (
              <div key={w} className={`h-3 rounded bg-primary/20`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </GridItem>
      <GridItem span={12} md={4}>
        <div className="bg-card border border-border rounded-2xl p-6 min-h-[200px] flex flex-col gap-3 border-dashed">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Sidebar — span=12 / md:4
          </span>
          <div className="flex-1 space-y-2">
            {[80, 60, 90, 50].map((w, i) => (
              <div key={i} className={`h-3 rounded bg-muted`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </GridItem>
    </Grid>
  ),
};

// ---------------------------------------------------------------------------
// AutoGrid stories
// ---------------------------------------------------------------------------

/**
 * `auto-fill`: columns are created even if no items fill them — items don't stretch.
 */
export const AutoFill: Story = {
  render: () => (
    <AutoGrid mode="fill" minWidth="160px" gap="md">
      {COLORS.slice(0, 4).map((color, i) => (
        <Cell key={i} label={`Item ${i + 1}`} color={color} />
      ))}
    </AutoGrid>
  ),
};

/**
 * `auto-fit`: empty tracks collapse — items stretch to fill remaining space.
 */
export const AutoFit: Story = {
  render: () => (
    <AutoGrid mode="fit" minWidth="160px" gap="md">
      {COLORS.slice(0, 4).map((color, i) => (
        <Cell key={i} label={`Item ${i + 1}`} color={color} />
      ))}
    </AutoGrid>
  ),
};

/**
 * All six gap variants stacked for visual comparison.
 */
export const GapVariants: Story = {
  render: () => (
    <div className="space-y-8">
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <div key={gap}>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
            gap=&quot;{gap}&quot;
          </p>
          <Grid cols={6} gap={gap}>
            {COLORS.map((color, i) => (
              <GridItem key={i} span={1}>
                <Cell label={`col ${i + 1}`} color={color} />
              </GridItem>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  ),
};
