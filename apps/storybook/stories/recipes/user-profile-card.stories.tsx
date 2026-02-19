import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@aazucena/ui';
import { Globe, Email, Dots, User, ArrowRight, Shield } from '@aazucena/icons';

/**
 * ## User Profile Card Recipe
 * Demonstrates composing Avatar, Badge, Button, Tooltip, Separator, and DropdownMenu
 * into a rich user profile card.
 */
const meta = {
  title: 'Recipes/Cards/UserProfileCard',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A rich user profile card composed from Avatar, Badge, Tooltip, DropdownMenu, and Button primitives.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard profile card with avatar, badges, and action buttons.
 */
export const Default: Story = {
  render: () => (
    <TooltipProvider delayDuration={200}>
      <Card className="w-[340px] shadow-xl overflow-hidden">
        {/* Cover gradient */}
        <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-600" />
        <CardContent className="-mt-12 pb-6">
          <div className="flex items-end justify-between mb-4">
            <Avatar className="size-20 border-4 border-background shadow-xl">
              <AvatarFallback className="text-2xl font-black bg-primary/10">AA</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 pb-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" className="size-9 rounded-xl">
                    <Email className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send Message</TooltipContent>
              </Tooltip>
              <Button size="sm" className="rounded-xl h-9 px-4">
                <User className="mr-2 size-4" />
                Follow
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg tracking-tight">Aldrin Azucena</h3>
                <Badge variant="secondary" className="text-[10px] h-5">
                  PRO
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">@aazucena</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Full-stack developer specializing in React, Astro, and AI-driven experiences. Building
              the future of the web.
            </p>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <p className="font-black text-base">142</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="font-black text-base">8.4K</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-black text-base">247</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  ),
};

/**
 * Profile card with a dropdown menu for additional user actions.
 */
export const WithActions: Story = {
  render: () => (
    <TooltipProvider delayDuration={200}>
      <Card className="w-[340px] shadow-xl overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-600" />
        <CardContent className="-mt-12 pb-6">
          <div className="flex items-end justify-between mb-4">
            <Avatar className="size-20 border-4 border-background shadow-xl">
              <AvatarFallback className="text-2xl font-black bg-primary/10">AA</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 pb-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="size-9 rounded-xl">
                    <Dots className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="gap-2">
                    <Globe className="size-4" /> View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <ArrowRight className="size-4" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Shield className="size-4" /> Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="rounded-xl h-9 px-4">
                <User className="mr-2 size-4" />
                Follow
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight">Aldrin Azucena</h3>
            <p className="text-sm text-muted-foreground">@aazucena · Full-stack Developer</p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  ),
};
