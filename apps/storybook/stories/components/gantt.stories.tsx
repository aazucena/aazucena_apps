import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gantt, type GanttTask } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Horizontal timeline bar chart with date-positioned task bars.
 * - **UX:** Scrollable timeline with day labels, today marker line, and click-to-select tasks.
 * - **Design:** Split into Gantt (container) and GanttBar (task bar) for <150 lines each.
 * - **Accessibility:** Task bars have title tooltips with date ranges; today marker is visually distinct.
 */
const meta = {
  title: 'Components/Display/Gantt',
  component: Gantt,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gantt chart with horizontal task bars positioned by date. Features auto date range, today marker, optional progress bars, and row auto-layout to avoid overlap.',
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
    dayWidth: {
      control: 'number',
      description: 'Width of each day column in pixels',
      table: { category: 'Layout', defaultValue: { summary: '30' } },
    },
  },
} satisfies Meta<typeof Gantt>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();
const d = (offset: number) => new Date(today.getTime() + offset * 86400000);

const tasks: GanttTask[] = [
  { id: '1', label: 'Design', start: d(-5), end: d(0) },
  { id: '2', label: 'Frontend', start: d(-2), end: d(5) },
  { id: '3', label: 'Backend', start: d(1), end: d(8) },
  { id: '4', label: 'Testing', start: d(6), end: d(12) },
  { id: '5', label: 'Deploy', start: d(11), end: d(14) },
];

export const Basic: Story = {
  args: {
    tasks,
    onTaskClick: (task) => console.log('Clicked:', task.label),
  },
};

export const WithProgress: Story = {
  args: {
    tasks: tasks.map((t, i) => ({ ...t, progress: [100, 60, 30, 0, 0][i] })),
    onTaskClick: (task) => console.log('Clicked:', task.label),
  },
};

export const Glass: Story = {
  args: { ...Basic.args, variant: 'glass' },
  render: (args) => (
    <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
      <Gantt {...args} />
    </div>
  ),
};

export const Cyber: Story = {
  args: { ...Basic.args, variant: 'cyber' },
};

export const LongTimeline: Story = {
  args: {
    tasks: [
      { id: '1', label: 'Phase 1', start: d(-30), end: d(-10), progress: 100, color: '#10b981' },
      { id: '2', label: 'Phase 2', start: d(-12), end: d(5), progress: 70, color: '#3b82f6' },
      { id: '3', label: 'Phase 3', start: d(3), end: d(20), progress: 10, color: '#8b5cf6' },
      { id: '4', label: 'Phase 4', start: d(18), end: d(40), color: '#f59e0b' },
      { id: '5', label: 'Phase 5', start: d(35), end: d(50), color: '#ef4444' },
    ],
    dayWidth: 20,
  },
};
