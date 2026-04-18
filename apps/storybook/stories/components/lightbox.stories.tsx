import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import { useState } from 'react';
import { Lightbox } from '@aazucena/ui';
import { Button } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Controlled/uncontrolled image overlay with full keyboard and swipe navigation.
 * - **UX:** Keyboard (Escape, ArrowLeft, ArrowRight) + native touch swipe; close-on-backdrop-click.
 * - **Architecture:** Extracted from Gallery's inline lightbox; composable standalone primitive.
 * - **Accessibility:** `role="dialog"`, `aria-modal`, `aria-label` on all icon buttons; focus trapped on open.
 */
const meta = {
  title: 'Components/Content/Lightbox',
  component: Lightbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A standalone image lightbox overlay with keyboard navigation, native touch swipe, caption support, and a thumbnail strip. Supports controlled and uncontrolled open state.',
      },
    },
  },
  tags: ['autodocs', 'interaction-test'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual overlay theme',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'default' },
      },
    },
    showThumbnails: {
      control: 'boolean',
      description: 'Show thumbnail strip at the bottom',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'true' },
      },
    },
    showCaption: {
      control: 'boolean',
      description: 'Show image caption overlay',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'true' },
      },
    },
    initialIndex: {
      control: 'number',
      description: 'Starting image index',
      table: {
        category: 'Behavior',
        defaultValue: { summary: '0' },
      },
    },
  },
} satisfies Meta<typeof Lightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const sampleImages = Array.from({ length: 6 }, (_, i) => ({
  src: `https://picsum.photos/seed/${i + 20}/800/600`,
  alt: `Photo ${i + 1}`,
  thumbnail: `https://picsum.photos/seed/${i + 20}/150/150`,
  caption: `Caption for photo ${i + 1} — a scenic landscape from the collection`,
}));

// ---------------------------------------------------------------------------
// Controlled wrapper helper
// ---------------------------------------------------------------------------

const LightboxWithTrigger = ({
  variant,
  showThumbnails,
  showCaption,
  images,
}: {
  variant?: 'default' | 'glass' | 'cyber';
  showThumbnails?: boolean;
  showCaption?: boolean;
  images?: typeof sampleImages;
}) => {
  const [open, setOpen] = useState(false);
  const imgs = images ?? sampleImages;
  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Lightbox ({imgs.length} images)
      </Button>
      <Lightbox
        images={imgs}
        variant={variant}
        open={open}
        onOpenChange={setOpen}
        showThumbnails={showThumbnails}
        showCaption={showCaption}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/**
 * Standard lightbox with 6 images, thumbnails, and captions. Click the button to open.
 */
export const Default: Story = {
  args: {
    images: sampleImages,
  },
  render: () => <LightboxWithTrigger />,
  play: async ({ canvasElement }: any) => {
    const canvas = within(canvasElement);
    // Open lightbox
    await userEvent.click(canvas.getByRole('button', { name: /open lightbox/i }));
    // Dialog should appear in document body
    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeVisible();
    // Navigate to next image
    const nextBtn = within(document.body).getByRole('button', { name: /next image/i });
    await userEvent.click(nextBtn);
    // Close via ESC
    await userEvent.keyboard('{Escape}');
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/**
 * Glass overlay variant — frosted dark backdrop with translucent UI elements.
 */
export const Glass: Story = {
  args: {
    images: sampleImages.slice(0, 4),
    variant: 'glass',
  },
  render: () => (
    <div className="p-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700">
      <LightboxWithTrigger variant="glass" images={sampleImages.slice(0, 4)} />
    </div>
  ),
};

/**
 * Cyber overlay with deep black background and neon-accented navigation controls.
 */
export const Cyber: Story = {
  args: {
    images: sampleImages.slice(0, 4),
    variant: 'cyber',
  },
  render: () => (
    <div className="p-16 rounded-2xl bg-zinc-950 border border-cyan-500/10">
      <LightboxWithTrigger variant="cyber" images={sampleImages.slice(0, 4)} />
    </div>
  ),
};

/**
 * Single image — nav arrows and thumbnail strip are hidden; only close button is shown.
 */
export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]!],
  },
  render: () => <LightboxWithTrigger images={[sampleImages[0]!]} />,
};

/**
 * Captions overlay enabled — a text label appears over each image.
 */
export const WithCaptions: Story = {
  args: {
    images: sampleImages,
    showCaption: true,
  },
  render: () => <LightboxWithTrigger showCaption />,
};

/**
 * Thumbnail strip hidden — clean minimal lightbox with only arrow navigation.
 */
export const NoThumbnails: Story = {
  args: {
    images: sampleImages,
    showThumbnails: false,
  },
  render: () => <LightboxWithTrigger showThumbnails={false} />,
};
