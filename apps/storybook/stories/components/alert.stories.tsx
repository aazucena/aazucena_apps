import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle } from '@aazucena/ui';
import { 
  InfoCircle, 
  DangerTriangle, 
  Activity, 
  Terminal, 
  CheckCircle,
  Bell,
  CloudUpload,
  Refresh
} from '@aazucena/icons';
import { Button } from '@aazucena/ui';

/**
 * ## Accessibility (A11y)
 * - **Role:** Uses `role="alert"` to notify assistive technologies of important information.
 * - **Contrast:** All variants are checked for AA contrast ratios in both light and dark modes.
 * - **Dismissal:** When `dismissible` is true, a button with `aria-label="Close alert"` is rendered.
 * 
 * ## Engineering Status
 * - **Design:** `Verified`
 * - **Maturity:** `Stable`
 * - **Theme Support:** `AAZUCENA_v1`
 */
const meta = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  subcomponents: { AlertTitle, AlertDescription } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Displays a callout for user attention. Useful for success messages, errors, warnings, or technical status updates.',
      },
    },
  },
  tags: ['autodocs', 'stable', 'a11y-verified'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'warning', 'success', 'error', 'destructive', 'dashboard', 'glass', 'cyber'],
      description: 'The visual style of the alert',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'default' },
      },
    },
    icon: {
      control: 'text',
      description: 'Optional icon to display on the left. Supports Icon components or string IDs.',
      table: {
        category: 'Content',
      },
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert can be dismissed by the user.',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
      },
    },
    borderAccent: {
      control: 'boolean',
      description: 'Adds a strong visual accent on the left side of the alert.',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback function triggered when the close button is clicked.',
      table: {
        category: 'Behavior',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[450px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- BASIC USAGE ---

/**
 * The primary playground for the Alert. 
 * **Interact with the Controls below** to live-edit the variant, icon, and dismissibility.
 */
export const Basic: Story = {
  args: {
    variant: 'default',
    icon: InfoCircle,
    dismissible: false,
    borderAccent: false,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Notification</AlertTitle>
      <AlertDescription>
        A new version of the engineering terminal is now available for deployment.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with a single line of content, typically just a description or just a title.
 */
export const SingleLine: Story = {
  args: {
    variant: 'info',
    icon: InfoCircle,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertDescription>
        Telemetry stream 0.4.2 is now active and stable.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert without an icon for a more minimalist look.
 */
export const NoIcon: Story = {
  args: {
    variant: 'default',
    icon: null,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>System Notice</AlertTitle>
      <AlertDescription>
        Maintenance window scheduled for tomorrow at 02:00 UTC.
      </AlertDescription>
    </Alert>
  ),
};

// --- SEMANTIC VARIANTS ---

export const Info: Story = {
  args: {
    variant: 'info',
    icon: InfoCircle,
    borderAccent: true,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Updating the local database with the latest telemetry stream.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    icon: DangerTriangle,
    borderAccent: true,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Your current session is about to expire in 5 minutes.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: {
    variant: 'success',
    icon: CheckCircle,
    borderAccent: true,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        All system deployments were executed successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const Error: Story = {
  args: {
    variant: 'error',
    icon: DangerTriangle,
    borderAccent: true,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>System Error</AlertTitle>
      <AlertDescription>
        An unexpected error occurred while processing the telemetry data.
      </AlertDescription>
    </Alert>
  ),
};

// --- SPECIAL VARIANTS ---

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    icon: DangerTriangle,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Critical Error</AlertTitle>
      <AlertDescription>
        The ClickHouse connection was lost. Telemetry ingestion has been suspended.
      </AlertDescription>
    </Alert>
  ),
};

export const Dashboard: Story = {
  args: {
    variant: 'dashboard',
    icon: Activity,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>System Integrity</AlertTitle>
      <AlertDescription>
        All kernel processes are operating within nominal parameters.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Frosted glass variant with soft borders, ideal for atmospheric portfolio layers.
 */
export const Glass: Story = {
  args: {
    variant: 'glass',
    icon: CheckCircle,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>
        The atmospheric layer transition has completed successfully.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Engineering-first variant with glowing cyan accents and high contrast.
 */
export const Cyber: Story = {
  args: {
    variant: 'cyber',
    icon: Terminal,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>// SIGNAL_LOCKED</AlertTitle>
      <AlertDescription>
        Protocol 0.4.2 established. Encrypted channel is now open.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Specific use case for important system-wide announcements.
 */
export const Announcement: Story = {
  args: {
    variant: 'default',
    icon: Bell,
    borderAccent: true,
    className: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Important Announcement</AlertTitle>
      <AlertDescription>
        The AAZUCENA Design System v2.0 is launching next week. Stay tuned for the engineering workshop.
      </AlertDescription>
    </Alert>
  ),
};

// --- COMPOSITION ---

/**
 * Demonstrate an Alert containing a list of items in the description.
 */
export const WithList: Story = {
  args: {
    variant: 'default',
    icon: InfoCircle,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Update Requirements</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Node.js version {'>'}= 18.0.0</li>
          <li>Latest pnpm workspace config</li>
          <li>Strapi v5 authorization token</li>
        </ul>
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Demonstrates the dismissible functionality with state management.
 */
export const Dismissible: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);
    
    return (
      <div className="flex flex-col gap-4">
        {isVisible ? (
          <Alert variant="info" icon={InfoCircle} dismissible onClose={() => setIsVisible(false)}>
            <AlertTitle>Dismissible Alert</AlertTitle>
            <AlertDescription>
              Click the close button on the right to dismiss this notification.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex justify-center p-4 border border-dashed rounded-xl border-zinc-300 dark:border-zinc-700">
            <Button variant="outline" size="sm" onClick={() => setIsVisible(true)}>
              <Refresh className="h-3 w-3 mr-2" />
              Reset Alert
            </Button>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Demonstrate using the Alert without an explicit icon prop, manually placing it inside.
 */
export const ManualPlacement: Story = {
  render: () => (
    <Alert variant="default">
      <Bell className="h-4 w-4 text-blue-500" />
      <AlertTitle>Update Available</AlertTitle>
      <AlertDescription>
        You have 3 pending updates for your dashboard components.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Demonstrate complex description content with a status indicator.
 */
export const ComplexContent: Story = {
  args: {
    variant: 'dashboard',
    icon: CloudUpload,
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Uploading Logs</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col gap-2 mt-2">
          <p>Transferring 4.2GB of telemetry data to the cloud...</p>
          <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/3" />
          </div>
          <span className="text-[10px] opacity-50 uppercase font-mono tracking-widest">67% COMPLETED</span>
        </div>
      </AlertDescription>
    </Alert>
  ),
};
