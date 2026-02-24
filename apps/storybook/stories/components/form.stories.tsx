import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as z from 'zod';
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Toaster,
  Badge,
  toast
} from '@aazucena/ui';
import { 
  ControlledInput, 
  ControlledTextarea, 
  ControlledCheckbox,
  FormButton, 
  FormErrorSummary, 
  FormDebugger,
  useStrapiFormMutation
} from '@aazucena/forms';
import { Shield, Zap, Activity, Send } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI + TanStack Form + Zod for type-safe validation and high-performance forms.
 * - **UX:** Features integrated validation state handling, animated messages, and tactile submission feedback.
 * - **Design:** Optimized for technical configuration panels with full theme support (Cyber, Glass).
 */
const meta = {
  title: 'Components/Forms/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust form system built on top of TanStack Form. Provides a standardized structure using ControlledField components for high-density engineering UIs.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- SCHEMAS ---

const loginSchema = z.object({
  username: z.string().min(2, { message: 'IDENT_INVALID: Minimum 2 characters required.' }),
  password: z.string().min(8, { message: 'SECURITY_LOW: Password too short.' }),
});

const configSchema = z.object({
  node_name: z.string().min(1, 'Required'),
  enable_uplink: z.boolean().default(false),
});

// --- STORIES ---

/**
 * Standard implementation using high-level ControlledInput and FormButton components.
 */
export const Basic: Story = {
  render: () => {
    const form = useForm({
      defaultValues: { username: '', password: '' },
      validatorAdapter: zodValidator(),
      onSubmit: async ({ value }) => {
        toast.success(`Access Granted: ${value.username}`);
      },
    } as any);

    return (
      <div className="w-[400px] p-8 border rounded-[2rem] bg-card shadow-2xl relative">
        <Toaster />
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Shield size={20} />
          </div>
          <h3 className="font-black tracking-tighter uppercase text-xl">Identity_Auth</h3>
        </div>
        
        <Form 
          form={form}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <ControlledInput
            name="username"
            label="Username"
            required
            validators={{ onChange: loginSchema.shape.username }}
            {...({ placeholder: "aazucena" } as any)}
          />
          
          <ControlledInput
            name="password"
            label="Access_Token"
            required
            validators={{ onChange: loginSchema.shape.password }}
            {...({ type: "password" } as any)}
          />
          
          <FormButton className="w-full h-12 rounded-full font-black uppercase tracking-widest mt-4">
            Initialize_Session
          </FormButton>
          <FormDebugger />
        </Form>
      </div>
    );
  },
};

/**
 * Technical configuration form showing Cyber variant and FormErrorSummary.
 */
const cyberQueryClient = new QueryClient();

// Inner component so that useStrapiFormMutation (which calls useQueryClient())
// executes inside the QueryClientProvider tree, not above it.
const CyberConfigFormInner = () => {
  const form = useForm({
    defaultValues: { node_name: 'US_EAST_01', enable_uplink: true },
    validatorAdapter: zodValidator(),
  } as any);

  useStrapiFormMutation('node-configs', {
    form,
    onSuccess: () => toast.success('Config Committed'),
  });

  return (
    <div className="w-[500px] p-8 border border-cyan-500/20 bg-black rounded-xl text-white shadow-[0_0_50px_rgba(6,182,212,0.1)] relative">
      <Toaster />
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Activity className="size-4 text-cyan-500 animate-pulse" />
          <span className="font-mono text-xs text-cyan-500 italic uppercase tracking-tighter text-glow-cyan">
            // NODE_CALIBRATION_v4
          </span>
        </div>
        <Badge variant="cyber">SECURE</Badge>
      </div>

      <Form
        form={form}
        variant="cyber"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        <FormErrorSummary title="Calibration_Faults" />

        <ControlledInput
          name="node_name"
          label="Identifier"
          required
          validators={{ onChange: configSchema.shape.node_name }}
          description="Assigned_Node_Alias"
        />

        <ControlledCheckbox
          name="enable_uplink"
          label="Global_Uplink"
          description="Enable real-time sync with main cluster."
          {...({ className: "flex flex-row items-center justify-between rounded-xl border border-cyan-500/10 p-4 bg-cyan-500/5" } as any)}
        />

        <FormButton variant="cyber" className="w-full h-12 uppercase font-black tracking-widest">
          <Zap className="mr-2 size-4" /> COMMIT_CHANGES
        </FormButton>
        <FormDebugger />
      </Form>
    </div>
  );
};

export const CyberConfig: Story = {
  render: () => (
    <QueryClientProvider client={cyberQueryClient}>
      <CyberConfigFormInner />
    </QueryClientProvider>
  ),
};

/**
 * Large format form showcasing high-level ControlledTextarea and custom validation messages.
 */
export const DetailedSubmission: Story = {
  render: () => {
    const schema = z.object({
      subject: z.string().min(5, 'Subject is too short'),
      message: z.string().min(20, 'Telemetry report requires more data'),
    });

    const form = useForm({
      defaultValues: { subject: '', message: '' },
      validatorAdapter: zodValidator(),
      onSubmit: async () => {
        toast.success('Report Transmitted');
      },
    } as any);

    return (
      <div className="w-[600px] relative">
        <Toaster />
        <Form 
          form={form}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <ControlledInput
            name="subject"
            label="Incident_Subject"
            required
            validators={{ onChange: schema.shape.subject }}
            {...({ placeholder: "Brief description of the anomaly..." } as any)}
          />
          
          <ControlledTextarea
            name="message"
            label="Full_Telemetry_Report"
            required
            className="min-h-[200px] rounded-2xl"
            validators={{ onChange: schema.shape.message }}
            description="Minimum 20 characters for technical analysis."
            {...({ placeholder: "Paste stack traces or detailed logs here..." } as any)}
          />
          
          <div className="flex justify-end pt-4">
            <FormButton size="lg" className="rounded-full px-12 h-14 font-black tracking-widest">
              Transmit_Report <Send className="ml-2 size-5" />
            </FormButton>
          </div>
          <FormDebugger />
        </Form>
      </div>
    );
  },
};
