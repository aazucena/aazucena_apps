import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@aazucena/ui';
import { Button, Input, Checkbox, Textarea, Badge, Toaster, toast } from '@aazucena/ui';
import { Shield, Zap, Activity, Globe, Send } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **Pattern:** Radix UI + React Hook Form + Zod for type-safe validation and accessible forms.
 * - **Accessibility:** Automatically links Labels, Descriptions, and Error messages using `aria-describedby` and `aria-invalid`.
 * - **UX:** Features integrated validation state handling with clear error messaging and tactile submission feedback.
 * - **Design:** Optimized for technical configuration panels and data entry modules.
 */
const meta = {
  title: 'Components/Forms/Form',
  component: Form,
  subcomponents: {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
  } as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A robust form system built on top of React Hook Form and Zod. Provides a standardized structure for handling complex validation and accessibility.',
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
  buffer_capacity: z.string(),
});

// --- STORIES ---

/**
 * Standard login form implementation with validation.
 */
export const Basic: Story = {
  render: () => {
    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: { username: '', password: '' },
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
      toast.success(`Access Granted: ${values.username}`);
    };

    return (
      <div className="w-[400px] p-8 border rounded-[2rem] bg-card shadow-2xl">
        <Toaster />
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Shield size={20} />
          </div>
          <h3 className="font-black tracking-tighter uppercase text-xl">Identity_Auth</h3>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black tracking-widest uppercase opacity-40">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="aazucena" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black tracking-widest uppercase opacity-40">
                    Access_Token
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 rounded-full font-black uppercase tracking-widest mt-4"
            >
              Initialize_Session
            </Button>
          </form>
        </Form>
      </div>
    );
  },
};

/**
 * Technical configuration form showing mixed input types and cyber aesthetics.
 */
export const CyberConfig: Story = {
  render: () => {
    const form = useForm<z.infer<typeof configSchema>>({
      resolver: zodResolver(configSchema),
      defaultValues: { node_name: 'US_EAST_01', enable_uplink: true, buffer_capacity: '1024' },
    });

    return (
      <div className="w-[500px] p-8 border border-cyan-500/20 bg-black rounded-xl text-white">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-cyan-500 animate-pulse" />
            <span className="font-mono text-xs text-cyan-500 italic uppercase tracking-tighter">
              // NODE_CALIBRATION_v4
            </span>
          </div>
          <Badge variant="cyber">SECURE</Badge>
        </div>

        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="node_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[9px] font-mono text-cyan-500/60 uppercase">
                    Identifier
                  </FormLabel>
                  <FormControl>
                    <Input variant="cyber" {...field} />
                  </FormControl>
                  <FormDescription className="text-[9px] text-white/20 uppercase font-mono">
                    Assigned_Node_Alias
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enable_uplink"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-white/5 p-4 bg-white/5">
                  <div className="space-y-0.5">
                    <FormLabel className="text-xs font-bold text-white">Global_Uplink</FormLabel>
                    <FormDescription className="text-[10px] text-white/40">
                      Enable real-time sync with main cluster.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button variant="cyber" className="w-full h-12 uppercase font-black tracking-widest">
              <Zap className="mr-2 size-4" /> COMMIT_CHANGES
            </Button>
          </form>
        </Form>
      </div>
    );
  },
};

/**
 * Large format form for long-form data entry like messages or bug reports.
 */
export const DetailedSubmission: Story = {
  render: () => {
    const form = useForm({
      defaultValues: { subject: '', message: '' },
    });

    return (
      <div className="w-[600px]">
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident_Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the anomaly..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full_Telemetry_Report</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste stack traces or detailed logs here..."
                      className="min-h-[200px] rounded-2xl"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Supports Markdown for code blocks and links.</FormDescription>
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button size="lg" className="rounded-full px-12 h-14 font-black tracking-widest">
                Transmit_Report <Send className="ml-2 size-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  },
};
