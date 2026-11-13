import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Atomic element for concise metadata display.
 * - **UX:** Features an optional `animated` pulse for real-time status indicators.
 * - **Design:** Optimized for `uppercase` and letter-spaced typography to match the technical brand aesthetic.
 * - **Semantic Range:** Includes color-coded service variants (Indigo, Sky, Emerald, Rose) for categorization.
 */
const meta = {
  title: 'Components/Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    // Figma component set in the Avra Design System file (addon-designs Design tab)
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/KIKPyhRdGbeBhj8dS0km2G/Avra-Design-System?node-id=4-95',
    },
    docs: {
      description: {
        component:
          'A small visual indicator for categorization, status, or counts. Supports a variety of brand-aligned visual styles and animated states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'destructive',
        'outline',
        'glass',
        'cyber',
        'indigo',
        'sky',
        'emerald',
        'rose',
      ],
      description: 'The visual style of the badge',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Physical dimensions and typography preset',
      table: { category: 'Appearance' },
    },
    animated: {
      control: 'boolean',
      description: 'Displays a pulsing status dot inside the badge',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard badge implementation.
 */
export const Basic: Story = {
  args: {
    children: 'STABLE_VERSION',
    variant: 'primary',
    size: 'sm',
  },
};

/**
 * High-fidelity cyber variant, ideal for technical specs and terminal logs.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    children: 'PROTOCOL_01',
  },
};

/**
 * Represents an active or real-time state using the pulsing status dot.
 */
export const ActiveStatus: Story = {
  args: {
    ...Basic.args,
    variant: 'outline',
    animated: true,
    children: 'LIVE_FEED',
  },
};

/**
 * Showcase of the various color-coded categorization variants.
 */
export const Categories: Story = {
  render: () => (
    <div className="flex gap-4">
      <Badge variant="indigo">DESIGN</Badge>
      <Badge variant="sky">RESEARCH</Badge>
      <Badge variant="emerald">DEPLOYED</Badge>
      <Badge variant="rose">HOTFIX</Badge>
    </div>
  ),
};

/**
 * Comparison of the available size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="xs">Extra Small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

/**
 * Glass variant: translucent `panel-glass` surface with a 1px rule, for use over imagery. Avra 0.2 has no blur, so check contrast against the backdrop.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-8 rounded-card">
      <Badge {...args}>IMMERSIVE_TAG</Badge>
    </div>
  ),
};

/**
 * Destructive: coral never carries meaning alone, so the badge adds the ▲ marker itself.
 */
export const Destructive: Story = {
  tags: ['interaction-test'],
  args: { children: 'ERROR_RATE', variant: 'destructive', size: 'sm' },
  play: async ({ canvasElement }: any) => {
    await expect(
      within(canvasElement)
        .getByText(/ERROR_RATE/)
        .closest('[class]')!.textContent,
    ).toMatch(/^▲\s?ERROR_RATE/);
  },
};
