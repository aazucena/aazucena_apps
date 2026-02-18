import type { Meta, StoryObj } from '@storybook/react-vite';
import { 
  ErrorPage, 
  ErrorPageContent, 
  ErrorPageVisual, 
  ErrorPageHeader, 
  ErrorPageTitle, 
  ErrorPageDescription, 
  ErrorPageActions, 
  ErrorPageFooter, 
  ErrorPageBeacon 
} from '@aazucena/ui';
import { 
  Maintenance, 
  MaintenanceIcon, 
  MaintenanceTitle, 
  MaintenanceMessage, 
  MaintenanceFooter 
} from '@aazucena/ui';
import { Button, Badge } from '@aazucena/ui';
import { Home, Refresh as RefreshCw, Wrench, Shield, Globe, ClockCircle, Lock } from '@aazucena/icons';

/**
 * ## Engineering Standards
 * - **CDD Pattern:** Orchestral layout suite for full-page status and error handling.
 * - **Aesthetics:** Features large-scale impact typography and high-fidelity background effects (Radial gradients, Neon borders).
 * - **UX:** Prioritizes clear recovery actions (Home, Reboot, Retry) and provides technical context via Error Beacons.
 * - **Variants:** Aligned with site-wide themes (`glass`, `cyber`) for consistent technical depth during failures.
 */
const meta = {
  title: 'Components/Layout/StatusPages',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A collection of components for building full-page error (404, 500) and maintenance states. Features high-impact visuals and standard ShadCN-aligned structures.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// --- STORIES ---

/**
 * Standard implementation for 404 Not Found errors.
 */
export const Error404: Story = {
  render: () => (
    <ErrorPage>
      <ErrorPageContent>
        <ErrorPageVisual status={404} />
        <ErrorPageHeader>
          <ErrorPageTitle>Sector_Not_Found</ErrorPageTitle>
          <ErrorPageDescription>
            The requested coordinates could not be located in the current node topology. It may have been relocated or purged.
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions>
          <Button size="lg" className="rounded-full px-10 h-14 font-black tracking-widest">
            <Home className="mr-2 size-5" /> Return_to_Root
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-10 h-14 font-black tracking-widest border-zinc-200">
            Report_Anomaly
          </Button>
        </ErrorPageActions>
        <ErrorPageFooter>
          <ErrorPageBeacon label="Diagnostic_Sequence_Running" />
        </ErrorPageFooter>
      </ErrorPageContent>
    </ErrorPage>
  )
};

/**
 * High-performance cyber variant for 500 Critical Server errors.
 */
export const Error500Cyber: Story = {
  render: () => (
    <ErrorPage variant="cyber">
      <ErrorPageContent>
        <ErrorPageVisual status={500} />
        <ErrorPageHeader className="space-y-4">
          <ErrorPageTitle className="text-cyan-500 font-mono italic tracking-tighter text-4xl md:text-6xl">
            // SYSTEM_CORRUPTION
          </ErrorPageTitle>
          <ErrorPageDescription className="text-cyan-500/40 font-mono text-[10px] tracking-[0.2em]">
            IDENT_FAILED // BUFFER_OVERFLOW // STACK_TRACE_ENABLED
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions className="mt-12">
          <Button variant="cyber" size="lg" className="h-14 px-12">
            <RefreshCw className="mr-2 animate-spin-slow" /> INITIATE_REBOOT
          </Button>
        </ErrorPageActions>
        <div className="mt-20 p-6 border-2 border-dashed border-cyan-500/10 rounded-2xl bg-cyan-500/5 max-w-md mx-auto">
          <p className="text-[10px] font-mono text-cyan-500/60 leading-relaxed">
            Incident ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}<br/>
            Timestamp: {new Date().toISOString()}<br/>
            Status: LISTENING_FOR_ADMIN_OVERRIDE
          </p>
        </div>
      </ErrorPageContent>
    </ErrorPage>
  )
};

/**
 * Standard maintenance mode implementation.
 */
export const MaintenanceMode: Story = {
  render: () => (
    <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-background">
      <Maintenance>
        <MaintenanceIcon className="text-primary animate-pulse" />
        <MaintenanceTitle className="text-4xl font-black tracking-tighter uppercase">Scheduled_Calibration</MaintenanceTitle>
        <MaintenanceMessage className="max-w-md mx-auto text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
          We're currently optimizing the global telemetry engines to improve ingestion latency. Synchronization will resume shortly.
        </MaintenanceMessage>
        <MaintenanceFooter className="mt-12">
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="rounded-full px-8 h-12">System Status</Button>
            <Button variant="ghost" className="rounded-full px-8 h-12">Contact Uplink</Button>
          </div>
        </MaintenanceFooter>
      </Maintenance>
    </div>
  )
};

/**
 * Immersive glass variant for status pages, ideal for placement over animated backgrounds.
 */
export const StatusGlass: Story = {
  render: () => (
    <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-blue-700 to-cyan-800 p-10 overflow-hidden">
      <ErrorPage variant="glass" className="w-full max-w-4xl min-h-[70vh] border-white/10 bg-white/5 backdrop-blur-2xl">
        <ErrorPageContent>
          <div className="flex justify-center mb-12">
            <Badge variant="cyber" className="bg-white/10 text-white border-white/20 px-6 py-2 rounded-full scale-125">
              MAINTENANCE_IN_PROGRESS
            </Badge>
          </div>
          <ErrorPageTitle className="text-white text-5xl mb-6">Cloud_Layer_Sync</ErrorPageTitle>
          <ErrorPageDescription className="text-white/60 mb-12">
            Atmospheric data points are being re-indexed across all orbital nodes.
          </ErrorPageDescription>
          <ErrorPageActions>
            <Button variant="glass" className="bg-white text-black hover:bg-white/90 rounded-full px-12 h-14">
              <Globe className="mr-2" /> View Global Map
            </Button>
          </ErrorPageActions>
        </ErrorPageContent>
      </ErrorPage>
    </div>
  )
};

// --- HTTP STATUS PRESET STORIES ---

/** 400 Bad Request — malformed input with retry action. */
export const Error400: Story = {
  render: () => (
    <ErrorPage>
      <ErrorPageContent>
        <ErrorPageVisual status={400} />
        <ErrorPageHeader>
          <ErrorPageTitle>Malformed_Request</ErrorPageTitle>
          <ErrorPageDescription>
            The submitted payload could not be parsed. Validate your input schema and retry the transmission.
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions>
          <Button size="lg" className="rounded-full px-10 h-14 font-black tracking-widest">
            <RefreshCw className="mr-2 size-5" /> Retry_Request
          </Button>
        </ErrorPageActions>
        <ErrorPageFooter>
          <ErrorPageBeacon label="Validation_Engine_Active" />
        </ErrorPageFooter>
      </ErrorPageContent>
    </ErrorPage>
  )
};

/** 401 Unauthorized — authentication required with login CTA. */
export const Error401: Story = {
  render: () => (
    <ErrorPage>
      <ErrorPageContent>
        <ErrorPageVisual status={401} />
        <ErrorPageHeader>
          <ErrorPageTitle>Authentication_Required</ErrorPageTitle>
          <ErrorPageDescription>
            Your session token has expired or is missing. Re-authenticate to regain access to this node.
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions>
          <Button size="lg" className="rounded-full px-10 h-14 font-black tracking-widest">
            <Lock className="mr-2 size-5" /> Authenticate
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-10 h-14 font-black tracking-widest border-zinc-200">
            <Home className="mr-2 size-5" /> Return_to_Root
          </Button>
        </ErrorPageActions>
        <ErrorPageFooter>
          <ErrorPageBeacon label="Auth_Protocol_Standby" />
        </ErrorPageFooter>
      </ErrorPageContent>
    </ErrorPage>
  )
};

/** 403 Access Denied — insufficient permissions. */
export const Error403: Story = {
  render: () => (
    <ErrorPage>
      <ErrorPageContent>
        <ErrorPageVisual status={403} />
        <ErrorPageHeader>
          <ErrorPageTitle>Clearance_Insufficient</ErrorPageTitle>
          <ErrorPageDescription>
            Your credentials lack the required privilege level for this restricted sector. Contact an administrator for escalation.
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions>
          <Button size="lg" className="rounded-full px-10 h-14 font-black tracking-widest">
            <Shield className="mr-2 size-5" /> Request_Clearance
          </Button>
        </ErrorPageActions>
        <ErrorPageFooter>
          <ErrorPageBeacon label="Security_Layer_Enforced" />
        </ErrorPageFooter>
      </ErrorPageContent>
    </ErrorPage>
  )
};

/** 408 Request Timeout — connection stalled with refresh action. */
export const Error408: Story = {
  render: () => (
    <ErrorPage>
      <ErrorPageContent>
        <ErrorPageVisual status={408} />
        <ErrorPageHeader>
          <ErrorPageTitle>Connection_Stalled</ErrorPageTitle>
          <ErrorPageDescription>
            The upstream node did not respond within the allocated time window. Network congestion or server overload may be the cause.
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions>
          <Button size="lg" className="rounded-full px-10 h-14 font-black tracking-widest">
            <RefreshCw className="mr-2 size-5" /> Retry_Connection
          </Button>
        </ErrorPageActions>
        <ErrorPageFooter>
          <ErrorPageBeacon label="Latency_Monitor_Active" />
        </ErrorPageFooter>
      </ErrorPageContent>
    </ErrorPage>
  )
};

/** 429 Rate Limited — throttled with cooldown narrative. */
export const Error429: Story = {
  render: () => (
    <ErrorPage>
      <ErrorPageContent>
        <ErrorPageVisual status={429} />
        <ErrorPageHeader>
          <ErrorPageTitle>Throughput_Throttled</ErrorPageTitle>
          <ErrorPageDescription>
            Request frequency has exceeded the permitted threshold. The rate limiter will reset shortly. Reduce request cadence and retry.
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions>
          <Button size="lg" className="rounded-full px-10 h-14 font-black tracking-widest">
            <ClockCircle className="mr-2 size-5" /> Wait_and_Retry
          </Button>
        </ErrorPageActions>
        <ErrorPageFooter>
          <ErrorPageBeacon label="Rate_Limiter_Engaged" />
        </ErrorPageFooter>
      </ErrorPageContent>
    </ErrorPage>
  )
};

/** 502 Bad Gateway — upstream failure. */
export const Error502: Story = {
  render: () => (
    <ErrorPage>
      <ErrorPageContent>
        <ErrorPageVisual status={502} />
        <ErrorPageHeader>
          <ErrorPageTitle>Upstream_Failure</ErrorPageTitle>
          <ErrorPageDescription>
            The gateway received an invalid response from the upstream service. Infrastructure teams have been alerted automatically.
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions>
          <Button size="lg" className="rounded-full px-10 h-14 font-black tracking-widest">
            <RefreshCw className="mr-2 size-5" /> Retry_Gateway
          </Button>
        </ErrorPageActions>
        <ErrorPageFooter>
          <ErrorPageBeacon label="Gateway_Recovery_Pending" />
        </ErrorPageFooter>
      </ErrorPageContent>
    </ErrorPage>
  )
};

/** 503 Service Unavailable — maintenance or overload. */
export const Error503: Story = {
  render: () => (
    <ErrorPage>
      <ErrorPageContent>
        <ErrorPageVisual status={503} />
        <ErrorPageHeader>
          <ErrorPageTitle>Node_Offline</ErrorPageTitle>
          <ErrorPageDescription>
            This service node is temporarily unavailable due to scheduled maintenance or capacity overflow. Normal operations will resume shortly.
          </ErrorPageDescription>
        </ErrorPageHeader>
        <ErrorPageActions>
          <Button size="lg" className="rounded-full px-10 h-14 font-black tracking-widest">
            <Wrench className="mr-2 size-5" /> View_Status
          </Button>
        </ErrorPageActions>
        <ErrorPageFooter>
          <ErrorPageBeacon label="Maintenance_Window_Active" />
        </ErrorPageFooter>
      </ErrorPageContent>
    </ErrorPage>
  )
};
