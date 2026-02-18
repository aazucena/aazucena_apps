import type { Meta, StoryObj } from '@storybook/react-vite';
import { AudioEmbed } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Compact inline audio player for embedding within content blocks, cards, or lists.
 * - **UX:** Single-action play/pause with animated progress bar and time readout in a minimal footprint.
 * - **Design:** Three variants (default, glass, cyber) and three size presets (sm, md, lg) for layout density.
 * - **Performance:** Uses native `<audio>` element with `onTimeUpdate` for lightweight state updates.
 */
const meta = {
  title: 'Components/Media/AudioEmbed',
  component: AudioEmbed,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A lightweight inline audio player designed for embedding within cards, lists, or content blocks. Features a play/pause button, progress bar, optional title label, and time counter. Supports default, glass, and cyber variants.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size preset controlling padding and gap',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    src: {
      control: 'text',
      description: 'Audio source URL (mp3, ogg, wav)',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    title: {
      control: 'text',
      description: 'Optional label displayed above the progress bar',
      table: {
        category: 'Content',
        type: { summary: 'string' },
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
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AudioEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_AUDIO = 'https://www.w3schools.com/html/horse.ogg';

// --- BASIC USAGE ---

/**
 * Standard audio embed with a descriptive title label.
 */
export const Basic: Story = {
  args: {
    src: SAMPLE_AUDIO,
    title: 'Voice Note - Feb 2026',
    variant: 'default',
    size: 'md',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glassmorphic variant with frosted background, ideal for immersive layouts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    title: 'Ambient Soundscape',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <AudioEmbed {...args} />
    </div>
  ),
};

/**
 * Cyber variant with neon accents and monospaced typography for terminal interfaces.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    title: 'SIGNAL_CAPTURE_03',
  },
};

// --- SIZE VARIANTS ---

/**
 * All three size presets shown vertically: small for dense lists, medium for cards, large for standalone.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AudioEmbed src={SAMPLE_AUDIO} size="sm" title="Small" />
      <AudioEmbed src={SAMPLE_AUDIO} size="md" title="Medium" />
      <AudioEmbed src={SAMPLE_AUDIO} size="lg" title="Large" />
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Compact mode without a title for tight list layouts where space is limited.
 */
export const NoTitle: Story = {
  args: {
    ...Basic.args,
    title: undefined,
    size: 'sm',
  },
};

/**
 * Multiple audio embeds stacked to simulate a playlist or feed layout.
 */
export const Playlist: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <AudioEmbed src={SAMPLE_AUDIO} title="Track 01 - Overture" />
      <AudioEmbed src={SAMPLE_AUDIO} title="Track 02 - Development" />
      <AudioEmbed src={SAMPLE_AUDIO} title="Track 03 - Recapitulation" />
    </div>
  ),
};
