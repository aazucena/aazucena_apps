import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster, toast } from '@aazucena/ui';
import { Button } from '@aazucena/ui';
import { Shield, Zap, Activity, Globe, CheckCircle, InfoCircle, DangerCircle } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Global notification primitive built on `sonner`.
 * - **Accessibility:** Uses standard ARIA live regions for announcements; supports keyboard interactions for actions.
 * - **UX:** Features non-blocking ephemeral messages with support for descriptions and primary/secondary actions.
 * - **Design:** Optimized for high-fidelity technical notifications with support for custom icons and branded themes.
 */
const meta = {
  title: 'Components/Primitives/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A standard toast notification system. Provides clear, concise feedback about an action or an event.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- STORIES ---

/**
 * Standard implementation for general system notices.
 */
export const Basic: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          toast("Session_Initialization_Successful", {
            description: "Binary pulse synchronized across all active node clusters.",
            action: {
              label: "Undo",
              onClick: () => {},
            },
          })
        }
      >
        Show Standard Toast
      </Button>
    </div>
  ),
};

/**
 * Demonstrates various semantic state toasts (Success, Error, Info).
 */
export const SemanticStates: Story = {
  render: () => (
    <div className="flex gap-4">
      <Toaster />
      <Button
        variant="outline"
        className="border-emerald-500/20 hover:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
        onClick={() =>
          toast.success("Uplink_Established", {
            icon: <CheckCircle className="size-4" />,
            description: "Connection to UNIT_0x7F42 is stable.",
          })
        }
      >
        Success
      </Button>

      <Button
        variant="outline"
        className="border-rose-500/20 hover:bg-rose-500/5 text-rose-600 dark:text-rose-400"
        onClick={() =>
          toast.error("Auth_Sequence_Failed", {
            icon: <DangerCircle className="size-4" />,
            description: "Invalid credentials detected at Edge_Node.",
          })
        }
      >
        Error
      </Button>

      <Button
        variant="outline"
        className="border-primary/20 hover:bg-primary/5"
        onClick={() =>
          toast.info("Maintenance_Notice", {
            icon: <InfoCircle className="size-4" />,
            description: "Kernel rotation scheduled in 14 minutes.",
          })
        }
      >
        Information
      </Button>
    </div>
  ),
};

/**
 * High-performance technical toast suitable for background processes.
 */
export const TechnicalTelemetry: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        variant="cyber"
        onClick={() =>
          toast("INGESTION_TRACE_ACTIVE", {
            icon: <Activity className="size-4 text-cyan-500 animate-pulse" />,
            description: "Monitoring packet flow from continental sectors...",
            className: "font-mono italic",
          })
        }
      >
        Show Technical Trace
      </Button>
    </div>
  ),
};

/**
 * Demonstrates toast with long-running promise states.
 */
export const PromiseState: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        variant="outline"
        onClick={() => {
          const promise = new Promise((resolve) => setTimeout(() => resolve({ name: 'Node_01' }), 2000));
          toast.promise(promise, {
            loading: 'Establishing Secure Enclave...',
            success: (data: any) => `Access Granted to ${data.name}`,
            error: 'Authorization Timeout',
          });
        }}
      >
        Trigger Process
      </Button>
    </div>
  ),
};
