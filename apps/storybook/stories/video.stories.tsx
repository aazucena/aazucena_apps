import type { Meta, StoryObj } from '@storybook/react-vite';
import { Video } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Enhanced video player with loading skeleton, poster overlay, and play/pause toggle.
 * - **UX:** Click-to-play overlay with smooth hover scale; poster image prevents bandwidth waste until interaction.
 * - **Design:** Three visual variants (default, glass, cyber) with configurable aspect ratio.
 * - **Performance:** Lazy loading skeleton shown until `onLoadedData` fires; thumbnail prevents preload.
 */
const meta = {
  title: 'Components/Media/Video',
  component: Video,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Enhanced video player with a loading skeleton, optional poster thumbnail, and click-to-play overlay. Supports default, glass, and cyber variants with configurable aspect ratios.',
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
    aspectRatio: {
      control: 'select',
      options: ['16/9', '4/3', '1/1', '21/9'],
      description: 'Video aspect ratio applied via CSS',
      table: {
        category: 'Appearance',
        type: { summary: "'16/9' | '4/3' | '1/1' | '21/9'" },
        defaultValue: { summary: '16/9' },
      },
    },
    src: {
      control: 'text',
      description: 'Video source URL',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    thumbnail: {
      control: 'text',
      description: 'Poster image URL shown before playback starts',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    autoPlay: {
      control: 'boolean',
      description: 'Automatically start playback',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    muted: {
      control: 'boolean',
      description: 'Mute audio output',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loop: {
      control: 'boolean',
      description: 'Loop playback continuously',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
} satisfies Meta<typeof Video>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';

// --- BASIC USAGE ---

/**
 * Standard video player with default styling and 16:9 aspect ratio.
 */
export const Basic: Story = {
  args: {
    src: SAMPLE_VIDEO,
    variant: 'default',
    aspectRatio: '16/9',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glassmorphic variant with frosted container, ideal for immersive hero sections.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Video {...args} />
    </div>
  ),
};

/**
 * Cyber variant with neon cyan border and glowing play button for terminal interfaces.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
  },
};

/**
 * Video with a thumbnail poster image shown before playback begins.
 */
export const WithThumbnail: Story = {
  args: {
    ...Basic.args,
    thumbnail: 'https://placehold.co/640x360/1a1a2e/cyan?text=Poster+Image',
  },
};

// --- ASPECT RATIOS ---

/**
 * Side-by-side comparison of all supported aspect ratios.
 */
export const AspectRatios: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['16/9', '4/3', '1/1', '21/9'] as const).map((ratio) => (
        <div key={ratio}>
          <p className="mb-1 text-xs font-medium text-muted-foreground">{ratio}</p>
          <Video src={SAMPLE_VIDEO} aspectRatio={ratio} />
        </div>
      ))}
    </div>
  ),
};

// --- ADVANCED ---

/**
 * Autoplay muted loop configuration commonly used for background video hero sections.
 */
export const AutoplayLoop: Story = {
  args: {
    ...Basic.args,
    autoPlay: true,
    muted: true,
    loop: true,
  },
};
