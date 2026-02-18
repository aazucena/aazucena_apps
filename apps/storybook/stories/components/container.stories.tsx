import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '@aazucena/ui';

/**
 * ## Engineering Standards
 *
 * | Principle | Detail |
 * |-----------|--------|
 * | CDD | Variant-driven (default / glass / cyber) + maxWidth (sm through full + prose) + center toggle |
 * | UX | Responsive horizontal padding (px-4 / sm:px-6 / lg:px-8) with auto-centering via mx-auto |
 * | Design | Layout primitive that constrains content width; pairs with Stack for vertical rhythm |
 */
const meta = {
  title: 'Components/Containers/Container',
  component: Container,
  parameters: {
    docs: {
      description: {
        component:
          'A responsive layout container that constrains content to a configurable max-width with responsive horizontal padding. Supports seven max-width breakpoints (sm, md, lg, xl, 2xl, full, prose), optional vertical centering, and three visual variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'prose'],
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'prose'" },
        defaultValue: { summary: 'xl' },
      },
    },
    center: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
    className: {
      control: 'text',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const Placeholder = ({ label }: { label: string }) => (
  <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
    {label}
  </div>
);

// --- BASIC USAGE ---

/**
 * Default container at xl max-width with responsive padding.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    maxWidth: 'xl',
    center: false,
    children: <Placeholder label="Container content (max-w-screen-xl)" />,
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant on a gradient background, demonstrating layout containment with visual flair.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Container {...args}>
        <Placeholder label="Glass container content" />
      </Container>
    </div>
  ),
};

/**
 * Cyber variant for terminal and dashboard layouts.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    children: <Placeholder label="Cyber container content" />,
  },
};

// --- MAX-WIDTH VARIANTS ---

/**
 * All seven max-width options stacked to visualize relative widths.
 */
export const MaxWidths: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md', 'lg', 'xl', '2xl', 'full', 'prose'] as const).map((mw) => (
        <Container key={mw} maxWidth={mw}>
          <div className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-center text-xs text-muted-foreground">
            maxWidth=&quot;{mw}&quot;
          </div>
        </Container>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Centered container with vertically aligned content using the center prop.
 */
export const Centered: Story = {
  args: {
    ...Basic.args,
    center: true,
    maxWidth: 'md',
  },
  render: (args) => (
    <Container {...args}>
      <div className="rounded-lg bg-primary/10 px-6 py-4 text-center text-sm font-medium text-primary">
        Centered content block
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        The center prop adds flex-col + items-center
      </p>
    </Container>
  ),
};

/**
 * Prose-width container ideal for long-form article or documentation content.
 */
export const ProseWidth: Story = {
  args: {
    maxWidth: 'prose',
  },
  render: (args) => (
    <Container {...args}>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Article Title</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The prose max-width constrains content to an optimal reading width of approximately 65
          characters per line. This improves readability for long-form text content such as blog
          posts, documentation, and legal pages.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Combined with responsive horizontal padding, the Container component ensures consistent
          margins across all viewport sizes.
        </p>
      </div>
    </Container>
  ),
};
