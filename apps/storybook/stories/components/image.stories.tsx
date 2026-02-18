import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Enhanced image component with loading skeleton, error fallback, and lazy loading.
 * - **UX:** Smooth opacity transition on load; graceful error state with configurable fallback.
 * - **Performance:** Native `loading="lazy"` for viewport-aware image loading. Skeleton pulse during load.
 */
const meta = {
  title: 'Components/Media/Image',
  component: Image,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Enhanced image component with loading skeleton, error fallback, and configurable aspect ratio. Supports 3 variants, 6 radius presets, and 4 object-fit modes with native lazy loading.',
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
        defaultValue: { summary: "'default'" },
      },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Border radius preset',
      table: {
        category: 'Appearance',
        type: { summary: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'" },
        defaultValue: { summary: "'md'" },
      },
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none'],
      description: 'Image object-fit mode',
      table: {
        category: 'Appearance',
        type: { summary: "'cover' | 'contain' | 'fill' | 'none'" },
        defaultValue: { summary: "'cover'" },
      },
    },
    aspectRatio: {
      control: 'text',
      description: 'CSS aspect-ratio value (e.g., "16/9", "4/3", "1/1")',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
      },
    },
    src: {
      control: 'text',
      description: 'Image source URL',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    alt: {
      control: 'text',
      description: 'Accessible alternative text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * Standard image with 4:3 aspect ratio and lazy loading skeleton.
 */
export const Basic: Story = {
  args: {
    src: 'https://picsum.photos/400/300',
    alt: 'Random landscape',
    aspectRatio: '4/3',
    variant: 'default',
    radius: 'md',
  },
};

// --- VISUAL VARIANTS ---

/**
 * Frosted glass variant for immersive UI contexts.
 */
export const Glass: Story = {
  args: {
    ...Basic.args,
    variant: 'glass',
    src: 'https://picsum.photos/400/300?random=2',
  },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Image {...args} />
    </div>
  ),
};

/**
 * Cyber variant with border and dark background for tech dashboards.
 */
export const Cyber: Story = {
  args: {
    ...Basic.args,
    variant: 'cyber',
    src: 'https://picsum.photos/400/225?random=3',
    aspectRatio: '16/9',
  },
};

// --- ADVANCED ---

/**
 * Error state showing the fallback icon when the image URL is broken.
 */
export const ErrorState: Story = {
  args: {
    src: 'https://invalid-url.example.com/broken.jpg',
    alt: 'Broken image',
    aspectRatio: '16/9',
  },
};

/**
 * Circular avatar image using radius="full".
 */
export const CircularAvatar: Story = {
  args: {
    src: 'https://picsum.photos/200?random=4',
    alt: 'User avatar',
    radius: 'full',
    className: 'h-24 w-24',
  },
};

/**
 * Showcase of all radius presets on identical images.
 */
export const RadiusPresets: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((r) => (
        <Image
          key={r}
          src={`https://picsum.photos/100?random=${r}`}
          alt={`radius-${r}`}
          radius={r}
          className="h-20 w-20"
        />
      ))}
    </div>
  ),
};
