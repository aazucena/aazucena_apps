import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { CardFlip, Card, CardContent } from '@aazucena/ui';
import { Button } from '@aazucena/ui';

const meta: Meta<typeof CardFlip> = {
  title: 'Components/Display/CardFlip',
  component: CardFlip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    front: {
      control: 'object',
      description: 'Content for the front side of the card.',
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
    back: {
      control: 'object',
      description: 'Content for the back side of the card.',
      table: {
        category: 'Content',
        type: { summary: 'React.ReactNode' },
      },
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the flip animation.',
      table: {
        category: 'Appearance',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
      },
    },
    duration: {
      control: 'number',
      description: 'Duration of the flip animation in milliseconds.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
        defaultValue: { summary: '600' },
      },
    },
    flipped: {
      control: 'boolean',
      description: 'Controls the flipped state externally.',
      table: {
        category: 'State',
        type: { summary: 'boolean' },
      },
    },
    onFlip: {
      action: 'flipped',
      description: 'Callback when the card is flipped.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    flipOnHover: {
      control: 'boolean',
      description: 'If true, the card flips on hover instead of click.',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    perspective: {
      control: 'number',
      description: 'The perspective property for the 3D transform effect.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
        defaultValue: { summary: '1000' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the card.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardFlip>;

const FrontContent = () => (
  <Card className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
    <CardContent className="p-4 text-center">
      <h3 className="text-xl font-bold">Front of Card</h3>
      <p className="text-sm">Click to reveal back</p>
    </CardContent>
  </Card>
);

const BackContent = () => (
  <Card className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
    <CardContent className="p-4 text-center">
      <h3 className="text-xl font-bold">Back of Card</h3>
      <p className="text-sm">More information here</p>
    </CardContent>
  </Card>
);

export const Default: Story = {
  args: {
    front: <FrontContent />,
    back: <BackContent />,
  },
};

export const ControlledFlip: Story = {
  render: (args) => {
    const [flipped, setFlipped] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <CardFlip
          {...args}
          front={<FrontContent />}
          back={<BackContent />}
          flipped={flipped}
          onFlip={setFlipped}
        />
        <Button onClick={() => setFlipped(!flipped)}>
          {flipped ? 'Flip to Front' : 'Flip to Back'}
        </Button>
      </div>
    );
  },
};

export const VerticalFlip: Story = {
  args: {
    front: <FrontContent />,
    back: <BackContent />,
    direction: 'vertical',
  },
};

export const CyberVariant: Story = {
  args: {
    front: (
      <Card className="flex h-full w-full items-center justify-center bg-black text-cyan-400 border border-cyan-500/20">
        <CardContent className="p-4 text-center font-mono">
          <h3 className="text-xl font-bold">INITIATE_HACK</h3>
          <p className="text-sm">ACCESS_GRANTED</p>
        </CardContent>
      </Card>
    ),
    back: (
      <Card className="flex h-full w-full items-center justify-center bg-black text-cyan-400 border border-cyan-500/20">
        <CardContent className="p-4 text-center font-mono">
          <h3 className="text-xl font-bold">DATA_RETRIEVED</h3>
          <p className="text-sm">ENCRYPTING_...</p>
        </CardContent>
      </Card>
    ),
    variant: 'cyber',
    duration: 800,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const GlassVariant: Story = {
  args: {
    front: (
      <Card className="flex h-full w-full items-center justify-center bg-white/5 text-white border border-white/10 backdrop-blur-md">
        <CardContent className="p-4 text-center">
          <h3 className="text-xl font-bold">Transparent Front</h3>
          <p className="text-sm">See through</p>
        </CardContent>
      </Card>
    ),
    back: (
      <Card className="flex h-full w-full items-center justify-center bg-white/5 text-white border border-white/10 backdrop-blur-md">
        <CardContent className="p-4 text-center">
          <h3 className="text-xl font-bold">Reflected Back</h3>
          <p className="text-sm">What lies beneath</p>
        </CardContent>
      </Card>
    ),
    variant: 'glass',
    duration: 1000,
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};

export const FlipOnHover: Story = {
  args: {
    front: <FrontContent />,
    back: <BackContent />,
    flipOnHover: true,
  },
};
