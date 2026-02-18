import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Image gallery with lightbox overlay and thumbnail navigation.
 * - **UX:** Keyboard navigation (ArrowLeft/Right + Escape) in lightbox; click-outside to close.
 * - **Performance:** Thumbnails load lazily via `loading="lazy"`; full images load only in lightbox.
 * - **Design:** Three column options (2/3/4), three gap sizes, and three visual variants.
 */
const meta = {
  title: 'Components/Media/Gallery',
  component: Gallery,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Image gallery with configurable grid layout and lightbox overlay. Supports thumbnail navigation, keyboard controls, and multiple column/gap configurations.',
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
    columns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Number of grid columns',
      table: {
        category: 'Layout',
        type: { summary: '2 | 3 | 4' },
        defaultValue: { summary: '3' },
      },
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between grid items',
      table: {
        category: 'Layout',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    items: {
      description: 'Array of image objects with src, alt, and optional thumbnail',
      table: {
        category: 'Content',
        type: { summary: 'GalleryItem[]' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImages = Array.from({ length: 6 }, (_, i) => ({
  src: `https://picsum.photos/seed/${i + 10}/600/400`,
  alt: `Sample image ${i + 1}`,
  thumbnail: `https://picsum.photos/seed/${i + 10}/150/150`,
}));

// --- BASIC USAGE ---

/**
 * Default 3-column gallery with six sample images. Click any thumbnail to open the lightbox.
 */
export const Basic: Story = {
  args: {
    items: sampleImages,
    columns: 3,
    gap: 'md',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Glass variant with frosted thumbnail cards on a gradient background.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with cyan border accents and dark background thumbnails.
 */
export const Cyber: Story = {
  args: {
    items: sampleImages.slice(0, 3),
    columns: 3,
    variant: 'cyber',
  },
};

// --- LAYOUT VARIANTS ---

/**
 * Two-column layout with larger gap for a spacious look.
 */
export const TwoColumns: Story = {
  args: {
    items: sampleImages.slice(0, 4),
    columns: 2,
    gap: 'lg',
  },
};

/**
 * Four-column compact grid with small gaps.
 */
export const FourColumns: Story = {
  args: {
    items: sampleImages.slice(0, 8).concat(
      Array.from({ length: 2 }, (_, i) => ({
        src: `https://picsum.photos/seed/${i + 20}/600/400`,
        alt: `Extra image ${i + 1}`,
        thumbnail: `https://picsum.photos/seed/${i + 20}/150/150`,
      })),
    ),
    columns: 4,
    gap: 'sm',
  },
};

// --- ADVANCED ---

/**
 * Minimal gallery with only two images to demonstrate lightbox navigation with limited items.
 */
export const MinimalGallery: Story = {
  args: {
    items: sampleImages.slice(0, 2),
    columns: 2,
    gap: 'md',
  },
};
