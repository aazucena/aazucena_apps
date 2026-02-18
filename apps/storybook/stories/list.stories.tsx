import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, ListItem } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Semantic list component replacing raw `<ul>`/`<ol>` elements.
 * - **UX:** Supports ordered, unordered, and unstyled list types with consistent spacing.
 * - **Design:** Cyber variant adds a `> ` prefix to each item for a terminal aesthetic.
 * - **Accessibility:** Renders correct `<ul>` or `<ol>` element based on `type` prop.
 */
const meta = {
  title: 'Components/Typography/List',
  component: List,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Semantic list component with variant styling. Supports unordered, ordered, and unstyled types with default, glass, cyber, and muted variants. Use with ListItem for per-item styling.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber', 'muted'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber' | 'muted'" },
        defaultValue: { summary: 'default' },
      },
    },
    type: {
      control: 'select',
      options: ['unordered', 'ordered', 'none'],
      description: 'List type — determines bullet style and rendered element',
      table: {
        category: 'Appearance',
        type: { summary: "'unordered' | 'ordered' | 'none'" },
        defaultValue: { summary: 'unordered' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size and indent level',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: { category: 'Styling' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard unordered list with default bullet markers.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    type: 'unordered',
    size: 'md',
  },
  render: (args) => (
    <List {...args}>
      <ListItem>React 19 with TypeScript</ListItem>
      <ListItem>Tailwind CSS 4</ListItem>
      <ListItem>Astro 5 meta-framework</ListItem>
      <ListItem>GSAP animations</ListItem>
    </List>
  ),
};

// --- VISUAL VARIANTS ---

/**
 * Glassmorphic variant for overlaid or translucent UI contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <List {...args}>
        <ListItem variant="glass">Blurred background layers</ListItem>
        <ListItem variant="glass">Frosted card surfaces</ListItem>
        <ListItem variant="glass">Translucent overlays</ListItem>
      </List>
    </div>
  ),
};

/**
 * Terminal-style list with `> ` prefix on each item for a hacker aesthetic.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    type: 'none',
  },
  render: (args) => (
    <List {...args}>
      <ListItem variant="cyber">SCANNING_PORTS...</ListItem>
      <ListItem variant="cyber">ENCRYPTING_PAYLOAD...</ListItem>
      <ListItem variant="cyber">DEPLOYING_MODULE...</ListItem>
    </List>
  ),
};

// --- SIZE VARIANTS ---

/**
 * Comparison of all three size tiers from small to large.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <p className="mb-1 text-xs font-mono text-muted-foreground">size=&quot;{s}&quot;</p>
          <List size={s}>
            <ListItem>First item</ListItem>
            <ListItem>Second item</ListItem>
          </List>
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Ordered list rendering as an `<ol>` with decimal markers.
 */
export const Ordered: Story = {
  args: {
    ...Basic.args,
    type: 'ordered',
  },
  render: (args) => (
    <List {...args}>
      <ListItem>Clone the repository</ListItem>
      <ListItem>Install dependencies with pnpm</ListItem>
      <ListItem>Run the dev server</ListItem>
      <ListItem>Open localhost:4321</ListItem>
    </List>
  ),
};

/**
 * Unstyled list with no bullet markers, useful for navigation or custom layouts.
 */
export const Unstyled: Story = {
  args: {
    ...Basic.args,
    type: 'none',
  },
  render: (args) => (
    <List {...args}>
      <ListItem>Dashboard</ListItem>
      <ListItem>Settings</ListItem>
      <ListItem>Profile</ListItem>
    </List>
  ),
};
