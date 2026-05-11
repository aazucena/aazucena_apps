import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandLogo, BrandLogoImage, BrandLogoInitials } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composite component for brand identity modules.
 * - **Logic:** Features automatic gradient assignment based on the `name` prop via utility hooks.
 * - **Variants:** Aligned with the `Avatar` component for system-wide cohesion (`glass`, `cyber`).
 * - **Scalability:** Uses standard size presets (`sm` to `xl`).
 */
const meta = {
  title: 'Components/Identity/BrandLogo',
  component: BrandLogo,
  subcomponents: { BrandLogoImage, BrandLogoInitials } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A standard container for project or company logos. Handles gradients, images, and text fallback states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style of the container',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Standard size presets',
      table: { category: 'Appearance' },
    },
    name: {
      control: 'text',
      description: 'Used to determine the default gradient color',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * The standard logo implementation using initials and an auto-assigned gradient.
 */
export const Basic: Story = {
  args: {
    name: 'Aazucena',
    variant: 'default',
    size: 'default',
  },
  render: (args) => (
    <BrandLogo {...args}>
      <BrandLogoInitials>AA</BrandLogoInitials>
    </BrandLogo>
  ),
};

/**
 * Logo container with an actual brand image.
 */
export const WithImage: Story = {
  args: {
    name: 'Next.js',
    size: 'lg',
  },
  render: (args) => (
    <BrandLogo {...args}>
      <BrandLogoImage src="https://github.com/shadcn.png" alt="Brand" />
    </BrandLogo>
  ),
};

/**
 * High-performance cyber variant with neon glow and border.
 */
export const Cyber: Story = {
  args: {
    name: 'CyberLink',
    variant: 'cyber',
    size: 'lg',
  },
  render: (args) => (
    <BrandLogo {...args}>
      <BrandLogoInitials className="font-mono italic">CL</BrandLogoInitials>
    </BrandLogo>
  ),
};

/**
 * Comparison of the available size presets.
 */
export const Sizes: Story = {
  args: {
    name: 'Aazucena',
  },
  render: () => (
    <div className="flex items-end gap-6">
      <div className="text-center space-y-2">
        <BrandLogo size="sm" name="Small">
          <BrandLogoInitials>SM</BrandLogoInitials>
        </BrandLogo>
        <p className="text-[10px] font-mono opacity-50">SM</p>
      </div>
      <div className="text-center space-y-2">
        <BrandLogo size="default" name="Default">
          <BrandLogoInitials>DF</BrandLogoInitials>
        </BrandLogo>
        <p className="text-[10px] font-mono opacity-50">DEFAULT</p>
      </div>
      <div className="text-center space-y-2">
        <BrandLogo size="lg" name="Large">
          <BrandLogoInitials>LG</BrandLogoInitials>
        </BrandLogo>
        <p className="text-[10px] font-mono opacity-50">LG</p>
      </div>
      <div className="text-center space-y-2">
        <BrandLogo size="xl" name="ExtraLarge">
          <BrandLogoInitials>XL</BrandLogoInitials>
        </BrandLogo>
        <p className="text-[10px] font-mono opacity-50">XL</p>
      </div>
    </div>
  ),
};

/**
 * Glass variant over a complex background to demonstrate blur.
 */
export const Glass: Story = {
  args: {
    name: 'GlassDesign',
    variant: 'glass',
    size: 'xl',
  },
  render: (args) => (
    <div className="p-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem]">
      <BrandLogo {...args}>
        <BrandLogoInitials>GD</BrandLogoInitials>
      </BrandLogo>
    </div>
  ),
};
