import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Announcement } from '@aazucena/ui';
import { Lightbulb, Zap } from '@aazucena/icons';
import { toast, Toaster } from '@aazucena/ui';

const meta: Meta<typeof Announcement> = {
  title: 'Components/Content/Announcement',
  component: Announcement,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The primary message content of the announcement.',
    },
    actionText: {
      control: 'text',
      description: 'Text for an optional inline action button.',
    },
    onAction: {
      action: 'actionClicked',
      description: 'Callback triggered when the action text is clicked.',
    },
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'destructive', 'glass', 'cyber'],
      description: 'Visual variant of the announcement bar.',
    },
    dismissable: {
      control: 'boolean',
      description: 'If true, a close button is shown on the right.',
      defaultValue: false,
    },
    onClose: {
      action: 'closed',
      description: 'Callback when the close button is clicked.',
    },
    icon: {
      control: false,
      description: 'Custom icon to display on the left.',
    },
    details: {
      control: false,
      description: 'React node for expandable additional details shown in an overlay.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Announcement>;

export const Default: Story = {
  args: {
    message: 'We have updated our privacy policy.',
    actionText: 'Read more',
    onAction: () => console.log('Action clicked'),
  },
};

export const Info: Story = {
  args: {
    message: 'New version v2.4.0 is now available with significant performance improvements.',
    variant: 'info',
    actionText: 'View Changelog',
  },
};

export const Success: Story = {
  args: {
    message: 'Deployment successful! Your site is now live.',
    variant: 'success',
    dismissable: true,
  },
};

export const Warning: Story = {
  args: {
    message: 'Scheduled maintenance this Sunday between 02:00 and 04:00 UTC.',
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    message: 'System connectivity issues detected. Our engineers are investigating.',
    variant: 'destructive',
  },
};

export const CyberVariant: Story = {
  args: {
    message: 'SIGNAL_ENCRYPTION // ACTIVE_SECURE_LINK_ESTABLISHED',
    variant: 'cyber',
    actionText: 'VIEW_METRICS',
    icon: <Zap className="size-4" />,
  },
};

export const GlassVariant: Story = {
  args: {
    message: 'Crystal clear insights delivered to your terminal.',
    variant: 'glass',
    actionText: 'Explore',
    dismissable: true,
  },
};

export const WithDetails: Story = {
  args: {
    message: 'Important security update required for all users.',
    actionText: 'Update Now',
    variant: 'destructive',
    details: (
      <div className="space-y-2">
        <p className="font-bold">Security Bulletin X-2026</p>
        <p>A critical patch has been released to address zero-day vulnerabilities in the authentication layer.</p>
        <ul className="list-disc list-inside">
          <li>Patch ID: Auth-99</li>
          <li>Severity: Critical</li>
          <li>Action: Immediate reboot required</li>
        </ul>
      </div>
    ),
  },
};

export const CustomIcon: Story = {
  args: {
    message: 'Pro Tip: You can customize your dashboard layout in settings.',
    icon: <Lightbulb className="size-4 text-amber-400" />,
    variant: 'default',
  },
};
