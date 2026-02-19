import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageCrop } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Interactive image crop region with mouse drag and corner resize handles.
 * - **UX:** Dark overlay outside the crop area; draggable rectangle with 4 corner handles.
 * - **Design:** CSS clip-path for the overlay creates a clean cutout effect.
 * - **Accessibility:** Resize handles have distinct cursor styles for directional feedback.
 */
const meta = {
  title: 'Components/Forms/ImageCrop',
  component: ImageCrop,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interactive image cropper with draggable crop region and corner resize handles. Reports crop area as percentages. Supports optional aspect ratio locking.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    aspect: {
      control: 'number',
      description: 'Aspect ratio lock (width/height). Omit for free-form.',
      table: { category: 'Behavior' },
    },
    minWidth: {
      control: 'number',
      description: 'Minimum crop width in pixels',
      table: { category: 'Constraints', defaultValue: { summary: '50' } },
    },
    minHeight: {
      control: 'number',
      description: 'Minimum crop height in pixels',
      table: { category: 'Constraints', defaultValue: { summary: '50' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageCrop>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop';

export const Basic: Story = {
  args: {
    src: SAMPLE_IMAGE,
    onCropChange: (crop) => console.log('Crop:', crop),
  },
};

export const FixedAspect: Story = {
  args: {
    src: SAMPLE_IMAGE,
    aspect: 16 / 9,
    onCropChange: (crop) => console.log('Crop:', crop),
  },
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <ImageCrop {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { ...Basic.args, variant: 'cyber' },
};

export const Square: Story = {
  args: {
    src: SAMPLE_IMAGE,
    aspect: 1,
    onCropChange: (crop) => console.log('Crop:', crop),
  },
};
