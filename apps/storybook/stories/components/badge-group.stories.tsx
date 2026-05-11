import type { Meta, StoryObj } from '@storybook/react-vite';
import { BadgeGroup, BadgeGroupItem } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **Pattern:** Layout-driven component for displaying clusters of related metadata.
 * - **UX:** Supports automatic truncation with `maxItems` to prevent vertical layout explosion.
 * - **Logic:** Uses React context/state for expansion toggle.
 * - **Composition:** Works seamlessly with `Badge` and `BadgeGroupItem`.
 */
const meta = {
  title: 'Components/Data/BadgeGroup',
  component: BadgeGroup,
  subcomponents: { BadgeGroupItem } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A wrapper for clustering badges together with consistent spacing and alignment logic. Supports automatic truncation for long lists.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    alignment: {
      control: 'radio',
      options: ['left', 'center', 'right'],
      description: 'Horizontal distribution of badges',
      table: { category: 'Layout' },
    },
    spacing: {
      control: 'select',
      options: ['tight', 'default', 'wide'],
      description: 'Gap between badges',
      table: { category: 'Appearance' },
    },
    maxItems: {
      control: 'number',
      description: 'Maximum items to show before truncating',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof BadgeGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard cluster of badges with default spacing and alignment.
 */
export const Basic: Story = {
  args: {
    alignment: 'left',
    spacing: 'default',
  },
  render: (args) => (
    <BadgeGroup {...args}>
      <BadgeGroupItem>Astro</BadgeGroupItem>
      <BadgeGroupItem variant="secondary">React</BadgeGroupItem>
      <BadgeGroupItem variant="outline">Tailwind</BadgeGroupItem>
      <BadgeGroupItem variant="glass">GSAP</BadgeGroupItem>
    </BadgeGroup>
  ),
};

/**
 * Centered alignment, ideal for section headers or hero content.
 */
export const AlignedCenter: Story = {
  args: {
    alignment: 'center',
  },
  render: (args) => (
    <div className="w-[500px] border border-dashed p-12 rounded-3xl bg-muted/5">
      <BadgeGroup {...args}>
        <BadgeGroupItem variant="cyber">CORE_PROTOCOL</BadgeGroupItem>
        <BadgeGroupItem variant="cyber">NODE_ESTABLISHED</BadgeGroupItem>
        <BadgeGroupItem variant="cyber">SIGNAL_CLEAN</BadgeGroupItem>
      </BadgeGroup>
    </div>
  ),
};

/**
 * Use `maxItems` to automatically truncate long lists and provide an expansion toggle.
 */
export const Truncation: Story = {
  args: {
    maxItems: 3,
  },
  render: (args) => (
    <div className="w-[300px]">
      <BadgeGroup {...args}>
        <BadgeGroupItem>TypeScript</BadgeGroupItem>
        <BadgeGroupItem>Next.js</BadgeGroupItem>
        <BadgeGroupItem>Three.js</BadgeGroupItem>
        <BadgeGroupItem>PixiJS</BadgeGroupItem>
        <BadgeGroupItem>D3.js</BadgeGroupItem>
        <BadgeGroupItem>PostgreSQL</BadgeGroupItem>
      </BadgeGroup>
    </div>
  ),
};

/**
 * Tight spacing for metadata-heavy UI modules like card footers.
 */
export const TightSpacing: Story = {
  args: {
    spacing: 'tight',
  },
  render: (args) => (
    <BadgeGroup {...args}>
      <BadgeGroupItem size="sm" variant="outline">
        v1.0.4
      </BadgeGroupItem>
      <BadgeGroupItem size="sm" variant="outline">
        MIT_LICENSE
      </BadgeGroupItem>
      <BadgeGroupItem size="sm" variant="outline">
        BUILD_PASSING
      </BadgeGroupItem>
    </BadgeGroup>
  ),
};
