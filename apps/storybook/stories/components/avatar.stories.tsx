import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarFallback, AvatarImage } from '@aazucena/ui';
import { User } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI wrapper with custom CVA variants for aesthetic depth.
 * - **Resilience:** Features automatic image loading detection with robust fallback states.
 * - **Variants:** Supports `glass` and `cyber` styles for high-fidelity UI context.
 * - **Scalability:** Uses a set of predefined `size` presets (sm to xl).
 */
const meta = {
  title: 'Components/Primitives/Avatar',
  component: Avatar,
  subcomponents: { AvatarImage, AvatarFallback } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An image element with a fallback for representing the user or entity. Includes built-in support for theme-aware visual variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual style of the container',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Predefined size preset',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard avatar implementation with a user image.
 */
export const Basic: Story = {
  args: {
    size: 'default',
    variant: 'default',
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/**
 * High-performance dark mode variant with a cyan border and subtle glow.
 */
export const Cyber: Story = {
  args: {
    size: 'lg',
    variant: 'cyber',
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop" />
      <AvatarFallback>AA</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Transparent glass variant with backdrop blur, ideal for overlaying on complex backgrounds.
 */
export const Glass: Story = {
  args: {
    size: 'lg',
    variant: 'glass',
  },
  render: (args) => (
    <div className="p-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl">
      <Avatar {...args}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Demonstrates the range of available size presets.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <div className="text-center space-y-2">
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <p className="text-[10px] font-mono opacity-50">SM</p>
      </div>
      <div className="text-center space-y-2">
        <Avatar size="default">
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
        <p className="text-[10px] font-mono opacity-50">DEFAULT</p>
      </div>
      <div className="text-center space-y-2">
        <Avatar size="lg">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <p className="text-[10px] font-mono opacity-50">LG</p>
      </div>
      <div className="text-center space-y-2">
        <Avatar size="xl">
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>
        <p className="text-[10px] font-mono opacity-50">XL</p>
      </div>
    </div>
  ),
};

/**
 * Visual feedback when the source image fails to load.
 */
export const Fallbacks: Story = {
  render: () => (
    <div className="flex gap-6">
      <Avatar variant="cyber" size="lg">
        <AvatarImage src="/invalid.jpg" />
        <AvatarFallback>AA</AvatarFallback>
      </Avatar>

      <Avatar variant="default" size="lg">
        <AvatarImage src="/invalid.jpg" />
        <AvatarFallback>
          <User className="h-6 w-6 opacity-50" />
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};
