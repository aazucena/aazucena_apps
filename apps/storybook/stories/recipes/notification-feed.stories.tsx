import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
} from '@aazucena/ui';
import { Bell } from '@aazucena/icons';

/**
 * ## Notification Feed Recipe
 * Demonstrates composing Avatar, Badge, Card, and Button into a notification feed.
 */
const meta = {
  title: 'Recipes/Cards/NotificationFeed',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A notification feed composed from Avatar, Badge, Card, and Button primitives.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const notifications = [
  {
    id: 1,
    name: 'Alex Chen',
    message: 'Reviewed your pull request and left 3 comments.',
    time: '2m ago',
    unread: true,
    avatar: 'AC',
  },
  {
    id: 2,
    name: 'Maria Santos',
    message: 'Invited you to collaborate on the Design System project.',
    time: '1h ago',
    unread: true,
    avatar: 'MS',
  },
  {
    id: 3,
    name: 'DevBot',
    message: 'Build #142 succeeded in 34s. All 87 tests passed.',
    time: '3h ago',
    unread: false,
    avatar: 'DB',
  },
  {
    id: 4,
    name: 'Jordan Lee',
    message: 'Mentioned you in a comment: "@you great work on the animations!"',
    time: '1d ago',
    unread: false,
    avatar: 'JL',
  },
];

type Notification = (typeof notifications)[0];

const NotificationItem = ({ notification }: { notification: Notification }) => (
  <div
    className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
      notification.unread ? 'bg-primary/5' : 'hover:bg-muted/50'
    }`}
  >
    <div className="relative flex-shrink-0">
      <Avatar className="size-9">
        <AvatarFallback className="text-xs font-bold">{notification.avatar}</AvatarFallback>
      </Avatar>
      {notification.unread && (
        <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary border-2 border-background" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold leading-none">{notification.name}</p>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
        {notification.message}
      </p>
      <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-mono">{notification.time}</p>
    </div>
  </div>
);

/**
 * Default notification feed with mixed read/unread states.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[380px] shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
            <Bell className="size-4" />
            Notifications
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            Mark all read
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 p-3 pt-0">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </CardContent>
    </Card>
  ),
};

/**
 * Feed showing only unread notifications with a count badge.
 */
export const WithUnread: Story = {
  render: () => (
    <Card className="w-[380px] shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
            <Bell className="size-4" />
            Notifications
            <Badge className="rounded-full px-2 h-5 text-[10px]">2</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            Mark all read
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 p-3 pt-0">
        {notifications
          .filter((n) => n.unread)
          .map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        <p className="text-center text-xs text-muted-foreground py-3">
          Showing 2 unread notifications
        </p>
      </CardContent>
    </Card>
  ),
};
