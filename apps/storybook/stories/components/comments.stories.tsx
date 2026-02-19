import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { Comments } from '@aazucena/ui';
import type { CommentData } from '@aazucena/ui';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Recursive thread renderer for nested comment trees with configurable depth limits.
 * - **UX:** Supports reply and like actions with visual nesting indicators (border-left lines).
 * - **Scalability:** `maxDepth` prop prevents unbounded nesting; flat rendering beyond the limit.
 */
const meta = {
  title: 'Components/Data Display/Comments',
  component: Comments,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A threaded comment display with nested replies, like actions, and configurable depth.',
      },
    },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Text size for comment content',
      table: { category: 'Appearance' },
    },
    maxDepth: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Maximum nesting depth for reply threads',
      table: { category: 'Behavior' },
    },
  },
} satisfies Meta<typeof Comments>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

const sampleComments: CommentData[] = [
  {
    id: '1',
    author: 'Alice',
    content: 'Great article! Really enjoyed the insights on component architecture.',
    timestamp: '2 hours ago',
    likes: 5,
    replies: [
      {
        id: '1-1',
        author: 'Bob',
        content: 'Agreed! The section on composition patterns was especially helpful.',
        timestamp: '1 hour ago',
        likes: 2,
      },
    ],
  },
  {
    id: '2',
    author: 'Charlie',
    content: 'Would love to see more examples of the cyber variant in action.',
    timestamp: '30 min ago',
    likes: 1,
  },
];

const deepComments: CommentData[] = [
  {
    id: '1',
    author: 'Alice',
    content: 'Top-level comment with a deep thread below.',
    timestamp: '3 hours ago',
    likes: 8,
    replies: [
      {
        id: '1-1',
        author: 'Bob',
        content: 'First reply in the thread.',
        timestamp: '2 hours ago',
        likes: 3,
        replies: [
          {
            id: '1-1-1',
            author: 'Charlie',
            content: 'Second level of nesting here.',
            timestamp: '1 hour ago',
            likes: 1,
            replies: [
              {
                id: '1-1-1-1',
                author: 'Diana',
                content: 'Third level - this is getting deep!',
                timestamp: '30 min ago',
                likes: 0,
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Standard comment thread with one nested reply.
 */
export const Basic: Story = {
  args: {
    comments: sampleComments,
    onReply: fn(),
    className: 'w-[500px]',
  },
};

/**
 * Comments with like action handlers wired up.
 */
export const WithLikes: Story = {
  args: {
    comments: sampleComments,
    onLike: fn(),
    onReply: fn(),
    className: 'w-[500px]',
  },
};

/**
 * Cyber variant with neon nesting indicators and dark styling.
 */
export const Cyber: Story = {
  args: {
    comments: sampleComments,
    variant: 'cyber',
    onReply: fn(),
    className: 'w-[500px]',
  },
};

/**
 * Deeply nested thread demonstrating 3 levels of reply nesting.
 */
export const DeepNesting: Story = {
  args: {
    comments: deepComments,
    maxDepth: 4,
    onReply: fn(),
    onLike: fn(),
    className: 'w-[500px]',
  },
};
