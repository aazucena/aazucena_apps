import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortableList } from '@aazucena/ui';
import { useState } from 'react';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Drag-and-drop reorderable list using the HTML5 Drag and Drop API.
 * - **UX:** Dragged item fades; drop target shows a top border indicator. Grip handle props exposed.
 * - **Design:** Zero-dependency DnD via native browser APIs (dataTransfer, dragOver, drop events).
 * - **Accessibility:** Items are draggable with visual feedback states for drag and drop targets.
 */
const meta = {
  title: 'Components/Data Display/SortableList',
  component: SortableList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Drag-and-drop reorderable list using native HTML5 DnD API. Provides dragHandleProps to renderItem so consumers control which element is the drag handle.',
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
  },
  decorators: [
    (Story) => (
      <div className="w-[20rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SortableList>;

export default meta;
type Story = StoryObj<typeof meta>;

type Item = { id: string; label: string };

const initialItems: Item[] = [
  { id: '1', label: 'Design system tokens' },
  { id: '2', label: 'Component library' },
  { id: '3', label: 'Storybook stories' },
  { id: '4', label: 'Unit tests' },
  { id: '5', label: 'E2E tests' },
];

const SortableDemo = (props: Partial<React.ComponentProps<typeof SortableList>>) => {
  const [items, setItems] = useState(initialItems);
  return (
    <SortableList
      items={items}
      onReorder={setItems as (items: unknown[]) => void}
      keyExtractor={(item: Item) => item.id}
      renderItem={(item: Item, _index: number, dragHandleProps) => (
        <div className="flex items-center gap-3 rounded-md border bg-background px-3 py-2">
          <span className="cursor-grab text-muted-foreground" {...dragHandleProps}>
            ⠿
          </span>
          <span className="text-sm">{item.label}</span>
        </div>
      )}
      {...props}
    />
  );
};

export const Basic: Story = {
  render: () => <SortableDemo />,
};

export const WithHandles: Story = {
  render: () => <SortableDemo />,
};

export const Glass: Story = {
  render: () => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <SortableDemo variant="glass" />
    </div>
  ),
};

export const Cyber: Story = {
  render: () => <SortableDemo variant="cyber" />,
};

export const Cards: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', label: 'Frontend', desc: 'React + TypeScript' },
      { id: '2', label: 'Backend', desc: 'Node.js + Strapi' },
      { id: '3', label: 'DevOps', desc: 'Docker + Railway' },
    ]);
    return (
      <SortableList
        items={items}
        onReorder={setItems as (items: unknown[]) => void}
        keyExtractor={(item: { id: string }) => item.id}
        renderItem={(item: { id: string; label: string; desc: string }, _i, handleProps) => (
          <div className="rounded-lg border bg-card p-3 shadow-sm" {...handleProps}>
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        )}
      />
    );
  },
};
