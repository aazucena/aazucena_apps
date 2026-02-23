import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { InfiniteCanvas } from '@aazucena/ui';

const meta: Meta<typeof InfiniteCanvas> = {
  title: 'Components/Display/InfiniteCanvas',
  component: InfiniteCanvas,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'number',
      description: 'Width of the canvas container.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
        defaultValue: { summary: '800' },
      },
    },
    height: {
      control: 'number',
      description: 'Height of the canvas container.',
      table: {
        category: 'Appearance',
        type: { summary: 'number' },
        defaultValue: { summary: '600' },
      },
    },
    minZoom: {
      control: 'number',
      description: 'Minimum zoom level.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '0.1' },
      },
    },
    maxZoom: {
      control: 'number',
      description: 'Maximum zoom level.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '4' },
      },
    },
    initialZoom: {
      control: 'number',
      description: 'Initial zoom level.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    initialPanX: {
      control: 'number',
      description: 'Initial horizontal pan position.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    initialPanY: {
      control: 'number',
      description: 'Initial vertical pan position.',
      table: {
        category: 'State',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    onViewportChange: {
      action: 'viewportChanged',
      description: 'Callback when the viewport (zoom/pan) changes.',
      table: {
        category: 'Behavior',
        type: { summary: '() => void' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual variant of the canvas container.',
      table: {
        category: 'Appearance',
        type: { summary: "'default' | 'glass' | 'cyber'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfiniteCanvas>;

const renderSimpleShapes = (ctx: CanvasRenderingContext2D, zoom: number, panX: number, panY: number) => {
  ctx.fillStyle = '#3b82f6'; // blue-500
  ctx.fillRect(50, 50, 100, 100);

  ctx.fillStyle = '#10b981'; // emerald-500
  ctx.beginPath();
  ctx.arc(250, 100, 50, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b'; // amber-500
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(350, 50);
  ctx.lineTo(450, 150);
  ctx.lineTo(350, 150);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Zoom: ${zoom.toFixed(2)}`, 10, 30);
  ctx.fillText(`Pan: (${panX.toFixed(0)}, ${panY.toFixed(0)})`, 10, 60);
};

export const Default: Story = {
  args: {
    width: 800,
    height: 600,
    renderContent: renderSimpleShapes,
  },
};

const renderNodes = (ctx: CanvasRenderingContext2D, zoom: number, panX: number, panY: number) => {
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const nodes = [
    { id: 'A', x: 100, y: 100, color: '#3b82f6' },
    { id: 'B', x: 300, y: 150, color: '#10b981' },
    { id: 'C', x: 200, y: 300, color: '#f59e0b' },
  ];

  nodes.forEach(node => {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fillText(node.id, node.x, node.y);
  });
};

export const NodesAndEdges: Story = {
  args: {
    width: 800,
    height: 600,
    renderContent: renderNodes,
  },
};

export const CyberVariant: Story = {
  args: {
    width: 1000,
    height: 700,
    variant: 'cyber',
    renderContent: (ctx) => {
      ctx.strokeStyle = '#06b6d4'; // cyan-500
      ctx.lineWidth = 1;
      for (let i = 0; i < ctx.canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, ctx.canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < ctx.canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
      }
      ctx.fillStyle = '#06b6d4';
      ctx.font = '24px monospace';
      ctx.fillText('// CYBER_GRID_ACTIVE', 50, 50);
    },
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
    width: 800,
    height: 600,
    variant: 'glass',
    renderContent: (ctx) => {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(100, 100, 200, 150);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(500, 300, 100, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '30px sans-serif';
      ctx.fillText('Glass Effect', 120, 180);
    },
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-8">
        <Story />
      </div>
    ),
  ],
};
