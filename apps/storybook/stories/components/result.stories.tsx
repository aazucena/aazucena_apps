import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Result,
  ResultActions,
  ResultContent,
  ResultDescription,
  ResultExtra,
  ResultIcon,
  ResultTitle,
} from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { Home, Refresh, CreditCard, Shield, ClockCircle } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Compound "Result" layout for centered post-action feedback (success, error, warning, info).
 * - **Taxonomy:** Bridges the gap between inline `Alert` and full-page `ErrorPage` — ideal for form outcomes, payment confirmations, and action completion.
 * - **Variants:** `default`, `glass`, `cyber` with optional `status` for semantic color mapping.
 * - **Icons:** Status-aware defaults (CheckCircle, DangerCircle, etc.) with custom icon override support.
 */
const meta = {
  title: 'Components/Feedback/Result',
  component: Result,
  subcomponents: {
    ResultIcon,
    ResultTitle,
    ResultDescription,
    ResultContent,
    ResultActions,
    ResultExtra,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A block-level status feedback component for post-action outcomes. Supports success, error, warning, and info states with customizable icons, actions, and supplemental content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'cyber'],
      description: 'Visual style variant',
      table: { category: 'Appearance' },
    },
    status: {
      control: 'select',
      options: [undefined, 'success', 'info', 'warning', 'error'],
      description: 'Semantic status for border color and icon defaults',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size preset',
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Result>;

export default meta;
type Story = StoryObj<typeof Result>;

// --- STORIES ---

/** Standard success outcome — order placed. */
export const Success: Story = {
  render: () => (
    <Result status="success">
      <ResultIcon status="success" />
      <ResultTitle>Order Placed Successfully</ResultTitle>
      <ResultDescription>
        Your order #ORD-2847 has been confirmed and is being processed. You'll receive a
        confirmation email shortly.
      </ResultDescription>
      <ResultActions>
        <Button>
          <Home className="mr-2 size-4" /> Go Home
        </Button>
      </ResultActions>
    </Result>
  ),
};

/** Error outcome with multiple recovery actions. */
export const Error: Story = {
  render: () => (
    <Result status="error">
      <ResultIcon status="error" />
      <ResultTitle>Payment Failed</ResultTitle>
      <ResultDescription>
        We couldn't process your payment. Please check your card details and try again.
      </ResultDescription>
      <ResultActions>
        <Button variant="destructive">
          <Refresh className="mr-2 size-4" /> Retry Payment
        </Button>
        <Button variant="outline">Contact Support</Button>
      </ResultActions>
    </Result>
  ),
};

/** Warning state for limit thresholds. */
export const Warning: Story = {
  render: () => (
    <Result status="warning">
      <ResultIcon status="warning" />
      <ResultTitle>Storage Quota Exceeded</ResultTitle>
      <ResultDescription>
        You've used 95% of your storage allocation. Upgrade your plan to continue uploading files.
      </ResultDescription>
      <ResultActions>
        <Button variant="outline">
          <CreditCard className="mr-2 size-4" /> Upgrade Plan
        </Button>
      </ResultActions>
    </Result>
  ),
};

/** Informational state for pending actions. */
export const Info: Story = {
  render: () => (
    <Result status="info">
      <ResultIcon status="info" />
      <ResultTitle>Review Pending</ResultTitle>
      <ResultDescription>
        Your submission has been received and is under review. This typically takes 1-2 business
        days.
      </ResultDescription>
    </Result>
  ),
};

/** Built-in success colors with a custom Trophy icon override. */
export const CustomIcon: Story = {
  render: () => (
    <Result status="success">
      <ResultIcon status="success" icon={<Shield className="size-7" />} />
      <ResultTitle>Achievement Unlocked</ResultTitle>
      <ResultDescription>
        You've completed all onboarding milestones. Your profile is now fully verified.
      </ResultDescription>
    </Result>
  ),
};

/** Fully custom status via className override on ResultIcon. */
export const CustomStatus: Story = {
  render: () => (
    <Result className="border-purple-500/30">
      <ResultIcon
        icon={<ClockCircle className="size-7" />}
        className="bg-purple-50 text-purple-600 ring-purple-500/20 dark:bg-purple-950/50 dark:text-purple-400"
      />
      <ResultTitle>Processing</ResultTitle>
      <ResultDescription>
        Your export is being generated. This may take a few minutes for large datasets.
      </ResultDescription>
    </Result>
  ),
};

/** Success result with supplemental footer data. */
export const WithExtra: Story = {
  render: () => (
    <Result status="success">
      <ResultIcon status="success" />
      <ResultTitle>Transfer Complete</ResultTitle>
      <ResultDescription>Your funds have been successfully transferred.</ResultDescription>
      <ResultActions>
        <Button>View Receipt</Button>
      </ResultActions>
      <ResultExtra>Transaction ID: TXN-8A3F-29B1-CC04</ResultExtra>
    </Result>
  ),
};

/** Compact size for constrained layouts. */
export const Compact: Story = {
  render: () => (
    <Result status="info" size="sm">
      <ResultIcon status="info" size="sm" />
      <ResultTitle className="text-base">Email Sent</ResultTitle>
      <ResultDescription className="text-xs">
        Check your inbox for the verification link.
      </ResultDescription>
    </Result>
  ),
};

/** Glass variant over a gradient background. */
export const Glass: Story = {
  render: () => (
    <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 p-12">
      <Result variant="glass" status="success" className="border-white/10 text-white">
        <ResultIcon status="success" className="bg-white/10 text-white ring-white/20" />
        <ResultTitle className="text-white">Deployment Successful</ResultTitle>
        <ResultDescription className="text-white/70">
          Your application has been deployed to production. All health checks passed.
        </ResultDescription>
        <ResultActions>
          <Button variant="glass" className="bg-white text-black hover:bg-white/90">
            View Dashboard
          </Button>
        </ResultActions>
      </Result>
    </div>
  ),
};

/** Cyber variant with neon aesthetic. */
export const Cyber: Story = {
  render: () => (
    <Result variant="cyber" status="error">
      <ResultIcon status="error" className="bg-cyan-950/50 text-cyan-400 ring-cyan-500/20" />
      <ResultTitle className="font-mono text-cyan-400">BREACH_DETECTED</ResultTitle>
      <ResultDescription className="font-mono text-cyan-500/60">
        Unauthorized access attempt logged. Security protocols have been escalated.
      </ResultDescription>
      <ResultActions>
        <Button variant="cyber">
          <Shield className="mr-2 size-4" /> Initiate_Lockdown
        </Button>
      </ResultActions>
      <ResultExtra className="border-cyan-500/10 font-mono text-cyan-500/40">
        Incident: INC-{Math.random().toString(16).slice(2, 10).toUpperCase()}
      </ResultExtra>
    </Result>
  ),
};
