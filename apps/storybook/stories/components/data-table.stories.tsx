import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable, type DataTableColumn, type DataTableProps } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Composes `Table` primitives with sorting, filtering, and pagination — zero external dependencies.
 * - **UX:** 3-state sort cycle (none → asc → desc), global search across all columns, paginated navigation.
 * - **Aesthetics:** Passes `variant` through to all Table sub-components for consistent theming.
 * - **Responsiveness:** Table container has overflow-auto for horizontal scroll on narrow viewports.
 */
const meta = {
  title: 'Components/Data Display/DataTable',
  component: DataTable,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A data table with built-in sorting, search filtering, pagination, and custom cell rendering. Composes Table primitives.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'The visual theme',
      table: { category: 'Appearance' },
    },
    pageSize: {
      control: 'number',
      description: 'Rows per page',
      table: { category: 'Behavior' },
    },
    searchable: {
      control: 'boolean',
      description: 'Show global search input',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<DataTableProps<any>>;

export default meta;
type Story = StoryObj<DataTableProps<any>>;

// --- SAMPLE DATA ---

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
  score: number;
}

const sampleData: User[] = [
  {
    name: 'Aldrin Azucena',
    email: 'aldrin@example.com',
    role: 'Engineer',
    status: 'Active',
    score: 98,
  },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Active', score: 87 },
  { name: 'Bob Johnson', email: 'bob@example.com', role: 'PM', status: 'Inactive', score: 72 },
  { name: 'Alice Chen', email: 'alice@example.com', role: 'Engineer', status: 'Active', score: 95 },
  { name: 'David Park', email: 'david@example.com', role: 'Designer', status: 'Active', score: 81 },
  { name: 'Eve Williams', email: 'eve@example.com', role: 'PM', status: 'Inactive', score: 68 },
  { name: 'Frank Lee', email: 'frank@example.com', role: 'Engineer', status: 'Active', score: 91 },
  { name: 'Grace Kim', email: 'grace@example.com', role: 'Designer', status: 'Active', score: 89 },
  {
    name: 'Hank Brown',
    email: 'hank@example.com',
    role: 'Engineer',
    status: 'Inactive',
    score: 76,
  },
  { name: 'Iris Davis', email: 'iris@example.com', role: 'PM', status: 'Active', score: 84 },
  { name: 'Jack Wilson', email: 'jack@example.com', role: 'Engineer', status: 'Active', score: 93 },
  { name: 'Kate Moore', email: 'kate@example.com', role: 'Designer', status: 'Active', score: 79 },
];

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'score', header: 'Score', sortable: true, width: '80px' },
];

// --- STORIES ---

/**
 * Basic table with sortable columns.
 */
export const Basic: Story = {
  args: {
    data: sampleData,
    columns,
    pageSize: 5,
  },
};

/**
 * With global search enabled across all columns.
 */
export const Searchable: Story = {
  args: {
    data: sampleData,
    columns,
    pageSize: 5,
    searchable: true,
    searchPlaceholder: 'Search users…',
  },
};

/**
 * Custom cell rendering with status badges.
 */
export const CustomRender: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'role', header: 'Role', sortable: true },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (value) => (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              value === 'Active'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {String(value)}
          </span>
        ),
      },
      {
        key: 'score',
        header: 'Score',
        sortable: true,
        width: '80px',
        render: (value) => <span className="font-mono font-semibold">{String(value)}</span>,
      },
    ] as DataTableColumn<User>[],
    pageSize: 6,
    searchable: true,
  },
};

/**
 * Glass variant over gradient background.
 */
export const Glass: Story = {
  args: {
    data: sampleData.slice(0, 5),
    columns,
    variant: 'glass',
  },
  decorators: [
    (Story) => (
      <div className="w-[700px] rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 p-10">
        <Story />
      </div>
    ),
  ],
};

/**
 * Cyber variant with neon styling.
 */
export const Cyber: Story = {
  args: {
    data: sampleData.slice(0, 5),
    columns,
    variant: 'cyber',
  },
  decorators: [
    (Story) => (
      <div className="w-[700px] rounded-[2rem] border border-cyan-500/10 bg-black p-10">
        <Story />
      </div>
    ),
  ],
};
