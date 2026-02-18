import type { Meta, StoryObj } from '@storybook/react-vite';
import { MusicPlayer } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Self-contained audio playback widget with transport controls, seek bar, and metadata display.
 * - **UX:** Exposes play/pause, seek, and loop controls with current/duration time counters.
 * - **Resilience:** Degrades gracefully when audio source is unavailable or unsupported.
 */
const meta = {
  title: 'Components/Media/MusicPlayer',
  component: MusicPlayer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A full-featured audio player with playback controls, seek bar, time display, and optional artwork. Supports multiple visual variants and sizes.',
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
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size preset',
      table: { category: 'Appearance' },
    },
    src: {
      control: 'text',
      description: 'Audio source URL',
      table: { category: 'Data' },
    },
    title: {
      control: 'text',
      description: 'Track title',
      table: { category: 'Data' },
    },
    artist: {
      control: 'text',
      description: 'Artist name',
      table: { category: 'Data' },
    },
    autoPlay: {
      control: 'boolean',
      description: 'Start playback automatically',
      table: { category: 'Behavior' },
    },
    loop: {
      control: 'boolean',
      description: 'Loop playback when track ends',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof MusicPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard player with track metadata displayed.
 */
export const Basic: Story = {
  args: {
    src: 'https://example.com/audio.mp3',
    title: 'Midnight Protocol',
    artist: 'Aldrin Azucena',
    className: 'w-[400px]',
  },
};

/**
 * Player displaying artwork alongside track information.
 */
export const WithArtwork: Story = {
  args: {
    src: 'https://example.com/audio.mp3',
    title: 'Crystal Frequencies',
    artist: 'Aldrin Azucena',
    artwork: 'https://picsum.photos/seed/artwork/120/120',
    className: 'w-[400px]',
  },
};

/**
 * High-performance cyber variant with neon accents and mono typography.
 */
export const Cyber: Story = {
  args: {
    src: 'https://example.com/audio.mp3',
    title: 'SIGNAL_TRACE_07',
    artist: 'SYS_OPERATOR',
    variant: 'cyber',
    className: 'w-[400px]',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-6">
        <Story />
      </div>
    ),
  ],
};

/**
 * Comparison of all three size presets rendered side by side.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-[450px] flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            {size}
          </span>
          <MusicPlayer
            src="https://example.com/audio.mp3"
            title="Midnight Protocol"
            artist="Aldrin Azucena"
            size={size}
          />
        </div>
      ))}
    </div>
  ),
};
