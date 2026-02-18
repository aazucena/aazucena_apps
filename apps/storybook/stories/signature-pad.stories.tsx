import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignaturePad } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Canvas 2D drawing surface for capturing signatures.
 * - **UX:** Mouse and touch support; clear to reset, save to export as PNG data URL.
 * - **Design:** Dashed border canvas with configurable stroke color and width.
 * - **Accessibility:** Cursor changes to crosshair over the drawing area.
 */
const meta = {
  title: 'Components/Forms/SignaturePad',
  component: SignaturePad,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Canvas-based signature pad supporting mouse and touch drawing. Exports the signature as a PNG data URL via the onSave callback. Zero external dependencies.',
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
    strokeColor: {
      control: 'color',
      description: 'Stroke color for drawing',
      table: { category: 'Drawing', defaultValue: { summary: 'currentColor' } },
    },
    strokeWidth: {
      control: 'number',
      description: 'Stroke width in pixels',
      table: { category: 'Drawing', defaultValue: { summary: '2' } },
    },
    width: {
      control: 'number',
      description: 'Canvas width in pixels',
      table: { category: 'Layout', defaultValue: { summary: '400' } },
    },
    height: {
      control: 'number',
      description: 'Canvas height in pixels',
      table: { category: 'Layout', defaultValue: { summary: '200' } },
    },
  },
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    onSave: (dataUrl) => console.log('Saved:', dataUrl.slice(0, 50) + '...'),
  },
};

export const CustomStroke: Story = {
  args: {
    strokeColor: '#3b82f6',
    strokeWidth: 4,
    onSave: (dataUrl) => console.log('Saved:', dataUrl.slice(0, 50) + '...'),
  },
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <SignaturePad {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { ...Basic.args, variant: 'cyber' },
};

export const Small: Story = {
  args: {
    ...Basic.args,
    width: 250,
    height: 120,
  },
};
