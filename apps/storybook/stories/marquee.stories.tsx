import type { Meta, StoryObj } from '@storybook/react-vite';
import { Marquee } from '@aazucena/ui';

const tags = ['React', 'TypeScript', 'Tailwind', 'Astro', 'Next.js', 'Vite'];

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Infinite horizontal scroll ticker for showcasing tags, logos, or announcements.
 * - **UX:** Pauses on hover by default to respect user attention and motor control.
 * - **Performance:** Pure CSS animation with no JS frame loops for zero main-thread cost.
 */
const meta = {
  title: 'Components/Data Display/Marquee',
  component: Marquee,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An infinite horizontal scroll ticker. Ideal for tech stacks, sponsor logos, or live feed tickers. Uses CSS animation for minimal performance overhead.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: { category: 'Appearance' },
    },
    speed: {
      control: { type: 'range', min: 5, max: 60, step: 5 },
      description: 'Animation duration in seconds (lower = faster)',
      table: { category: 'Animation' },
    },
    direction: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Scroll direction',
      table: { category: 'Animation' },
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Pause the animation when the user hovers',
      table: { category: 'Behavior' },
    },
    gap: {
      control: 'text',
      description: 'Gap between repeated content sets (CSS value)',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

const TagBadges = () => (
  <>
    {tags.map((t) => (
      <span
        key={t}
        className="rounded-full bg-muted px-4 py-2 text-sm font-medium"
      >
        {t}
      </span>
    ))}
  </>
);

/**
 * Standard left-scrolling tech stack ticker.
 */
export const Basic: Story = {
  args: {
    speed: 30,
    direction: 'left',
    className: 'w-full',
  },
  render: (args) => (
    <Marquee {...args}>
      <TagBadges />
    </Marquee>
  ),
};

/**
 * Right-to-left direction for alternate visual rhythm.
 */
export const RightDirection: Story = {
  args: {
    speed: 25,
    direction: 'right',
    className: 'w-full',
  },
  render: (args) => (
    <Marquee {...args}>
      <TagBadges />
    </Marquee>
  ),
};

/**
 * Hover pause disabled for continuous motion.
 */
export const NoPause: Story = {
  args: {
    speed: 20,
    pauseOnHover: false,
    className: 'w-full',
  },
  render: (args) => (
    <Marquee {...args}>
      <TagBadges />
    </Marquee>
  ),
};

/**
 * High-performance cyber variant with neon-styled badges.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
    speed: 25,
    className: 'w-full',
  },
  render: (args) => (
    <div className="rounded-2xl bg-black p-4">
      <Marquee {...args}>
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 font-mono text-xs text-cyan-300"
          >
            {t}
          </span>
        ))}
      </Marquee>
    </div>
  ),
};
