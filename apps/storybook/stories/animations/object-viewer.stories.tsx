/**
 * 3D Animation Object Viewer
 * Centralized hub for inspecting all registry objects.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ObjectViewer, ANIMATION_OBJECT_REGISTRY } from '@aazucena/animations';
import type { ComponentProps } from 'react';

const meta: Meta<ComponentProps<typeof ObjectViewer>> = {
  title: 'Animations/ThreeJS/Object Viewer',
  component: ObjectViewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive 3D inspector for all objects in the animation registry. This component is part of the @aazucena/animations package and can be used to create galleries or encyclopedias within the main app.',
      },
    },
  },
  tags: ['no-vitest'],
  argTypes: {
    objectKey: {
      name: 'Select Object',
      control: 'select',
      options: Object.keys(ANIMATION_OBJECT_REGISTRY),
      description: 'The registry key of the Three.js object to view.',
    },
    showGrid: {
      name: 'Show Grid',
      control: 'boolean',
    },
    autoRotate: {
      name: 'Auto Rotate',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<ComponentProps<typeof ObjectViewer>>;

export const Viewer: Story = {
  args: {
    objectKey: 'et-bike',
    showGrid: true,
    autoRotate: true,
  },
  render: (args) => (
    <div className="w-full h-screen">
      <ObjectViewer {...args} />
    </div>
  ),
};
