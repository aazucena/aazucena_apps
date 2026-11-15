import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardLayout } from '@aazucena/layouts';
import { within, userEvent, expect } from 'storybook/test';

/**
 * ## DashboardLayout
 *
 * Structural flex shell for sidebar-left / header-top / scrollable-main architectures.
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | **Composition** | `sidebar` and `header` are render slots — the consumer owns those components entirely |
 * | **Scroll** | Only the `<main>` region scrolls; sidebar and header are sticky |
 * | **Accessibility** | A "Skip to main content" link is the first tab stop and moves focus to `<main id="main-content">` |
 * | **Sizing** | `contentMaxWidth` constrains the inner content div; `contentPadding` sets inner spacing |
 *
 * The layout itself has no concept of navigation items, sidebar state, or header content.
 */
const meta = {
  title: 'Layouts/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A structural flex shell that assembles a sidebar-left + header-top + scrollable-main layout. Pass sidebar and header as render slots — the layout has no knowledge of their internals.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    contentMaxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', '7xl', 'full'],
      description: 'Max-width applied to the inner content wrapper',
      table: { category: 'Layout' },
    },
    contentPadding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding inside the scrollable content area',
      table: { category: 'Layout' },
    },
    sidebar: { control: false, table: { category: 'Slots' } },
    header: { control: false, table: { category: 'Slots' } },
    children: { control: false, table: { category: 'Slots' } },
  },
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Shared placeholder primitives
const SidebarSlot = ({ collapsed = false }: { collapsed?: boolean }) => (
  <aside
    className={`${collapsed ? 'w-16' : 'w-64'} h-full shrink-0 flex flex-col bg-card border-r border-border transition-all duration-300`}
  >
    <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
      {collapsed ? (
        <div className="size-6 rounded bg-primary/20" />
      ) : (
        <div className="flex items-center gap-3">
          <div className="size-6 rounded bg-primary/20" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            App_Name
          </span>
        </div>
      )}
    </div>
    <nav className="flex-1 p-3 space-y-1">
      {['Overview', 'Analytics', 'Registry', 'Settings'].map((label, i) => (
        <div
          key={label}
          className={`h-10 rounded-lg flex items-center gap-3 px-3 text-xs font-bold uppercase tracking-wider ${i === 0 ? 'bg-primary/10 text-primary' : 'text-muted-foreground '}`}
        >
          <div className="size-4 rounded bg-current opacity-60 shrink-0" />
          {!collapsed && label}
        </div>
      ))}
    </nav>
  </aside>
);

const HeaderSlot = () => (
  <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-border bg-background/80">
    <div className="flex items-center gap-3">
      <div className="h-5 w-24 rounded bg-muted animate-pulse" />
      <div className="size-1.5 rounded-full bg-success" />
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        Online
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-8 w-20 rounded-full bg-muted" />
      <div className="size-8 rounded-full bg-muted" />
    </div>
  </header>
);

const ContentPlaceholder = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-6">
    <div className="h-32 rounded-card border border-primary/20 flex items-center px-8">
      <div>
        <div className="h-6 w-48 rounded bg-foreground/10 mb-2" />
        <div className="h-3 w-32 rounded bg-foreground/5" />
      </div>
    </div>
    <div className={`grid grid-cols-${rows} gap-4`}>
      {Array.from({ length: rows * 2 }).map((_, i) => (
        <div
          key={i}
          className="h-40 rounded-card bg-card border border-border/50 border-dashed flex items-center justify-center"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Module_0{i + 1}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Standard sidebar + header + scrollable content layout.
 */
export const Default: Story = {
  args: {
    contentMaxWidth: '7xl',
    contentPadding: 'lg',
    sidebar: <SidebarSlot />,
    header: <HeaderSlot />,
    children: <></>,
  },
  render: (args) => (
    <DashboardLayout {...args} sidebar={<SidebarSlot />} header={<HeaderSlot />}>
      <ContentPlaceholder rows={3} />
    </DashboardLayout>
  ),
};

/**
 * Icon-only collapsed sidebar — demonstrates that the layout adapts to any sidebar width.
 */
export const CollapsedSidebar: Story = {
  args: {
    contentMaxWidth: '7xl',
    contentPadding: 'lg',
    sidebar: <SidebarSlot collapsed />,
    header: <HeaderSlot />,
    children: <></>,
  },
  render: (args) => (
    <DashboardLayout {...args} sidebar={<SidebarSlot collapsed />} header={<HeaderSlot />}>
      <ContentPlaceholder rows={3} />
    </DashboardLayout>
  ),
};

/**
 * Demonstrates all `contentMaxWidth` options with reduced padding.
 */
export const WithContentMaxWidths: Story = {
  args: {
    contentMaxWidth: '7xl',
    contentPadding: 'lg',
    sidebar: <SidebarSlot />,
    header: <HeaderSlot />,
    children: <></>,
  },
  parameters: {
    controls: { disable: true },
    // Seven layouts on one canvas means seven main regions; a real page has one.
    a11y: { config: { rules: [{ id: 'landmark-no-duplicate-main', enabled: false }] } },
  },
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      {(['sm', 'md', 'lg', 'xl', '2xl', '7xl', 'full'] as const).map((mw) => (
        <div
          key={mw}
          className="border border-border rounded-card overflow-hidden"
          style={{ height: 180 }}
        >
          <DashboardLayout
            sidebar={<div className="w-16 h-full bg-card border-r border-border" />}
            header={
              <div className="h-10 bg-muted border-b border-border flex items-center px-4">
                <span className="text-[10px] font-black text-muted-foreground">
                  contentMaxWidth=&quot;{mw}&quot;
                </span>
              </div>
            }
            contentMaxWidth={mw}
            contentPadding="sm"
            mainId={`main-${mw}`}
            mainLabel={`Content, max width ${mw}`}
            skipLink={false}
          >
            <div className="h-20 rounded-control bg-primary/10 border border-primary/20 border-dashed flex items-center justify-center">
              <span className="text-[10px] font-mono text-primary">
                max-w-{mw === '7xl' ? '7xl' : mw}
              </span>
            </div>
          </DashboardLayout>
        </div>
      ))}
    </div>
  ),
};

/** The skip link is the first tab stop and targets the main region. */
export const SkipToContent: Story = {
  ...Default,
  tags: ['!autodocs'],
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const skip = canvas.getByRole('link', { name: /skip to main content/i });
    await expect(skip).toHaveFocus();
    // Following a hash link reloads the test runner's page, so check the wiring instead:
    // the link points at the main region, and that region can take focus.
    const main = canvas.getByRole('main');
    await expect(skip).toHaveAttribute('href', `#${main.id}`);
    await expect(main).toHaveAttribute('tabindex', '-1');
    main.focus();
    await expect(main).toHaveFocus();
  },
};
