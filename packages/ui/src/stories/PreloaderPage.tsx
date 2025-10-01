export const Page = () => (
    <div className="p-6 space-y-8 bg-background min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Preloader Features</h1>
        <p className="text-muted-foreground">Explore the extensive customization options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <FeatureCard
          title="Timing Control"
          description="Fine-tune loading duration and behavior"
          features={[
            'minDisplayTime: Minimum display duration',
            'maxDisplayTime: Safety timeout',
            'autoStart: Automatic vs manual start',
            'animationDuration: Control animation speed'
          ]}
        />

        <FeatureCard
          title="User Experience"
          description="Enhanced UX features"
          features={[
            'enableSkip: User-controlled skipping',
            'transitionType: Multiple animation styles',
            'enableAnimations: Performance toggle',
            'lazyLoad: Viewport-based loading'
          ]}
        />

        <FeatureCard
          title="Content Customization"
          description="Fully customizable content"
          features={[
            'title/subtitle: Loading messages',
            'readyTitle/readySubtitle: Completion messages',
            'continueButtonText: Action button text',
            'customSteps: Tailored loading sequence'
          ]}
        />

        <FeatureCard
          title="Event Handling"
          description="Comprehensive callback system"
          features={[
            'onLoadingStart: Loading initiation',
            'onLoadingProgress: Real-time updates',
            'onComplete: Loading finished',
            'onSkip: User skip action',
            'onError: Error handling'
          ]}
        />
      </div>

      <div className="max-w-4xl mx-auto mt-12 p-6 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Basic Configuration</h4>
            <CodeExample
              title="Quick setup:"
              code={`<Preloader variant="interactive" />`}
            />
            <CodeExample
              title="Simple variant:"
              code={`<Preloader variant="simple" />`}
            />
            <CodeExample
              title="Custom timing:"
              code={`<Preloader
  minDisplayTime={2000}
  maxDisplayTime={8000}
/>`}
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Advanced Features</h4>
            <CodeExample
              title="With skip and callbacks:"
              code={`<Preloader
  enableSkip={true}
  onSkip={handleUserSkip}
  onProgress={trackAnalytics}
/>`}
            />
            <CodeExample
              title="Custom content:"
              code={`<Preloader
  title="Loading Your Workspace"
  readyTitle="Workspace Ready!"
  continueButtonText="Get Started"
/>`}
            />
            <CodeExample
              title="Performance optimized:"
              code={`<Preloader
  enableAnimations={false}
  lazyLoad={true}
/>`}
            />
          </div>
        </div>
      </div>
    </div>
)


// Helper components
interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
}

function FeatureCard({ title, description, features }: FeatureCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <ul className="space-y-2 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface CodeExampleProps {
  title: string;
  code: string;
}

function CodeExample({ title, code }: CodeExampleProps) {
  return (
    <div>
      <p className="text-muted-foreground mb-1 text-sm">{title}</p>
      <code className="bg-black text-green-400 px-3 py-2 rounded text-sm font-mono block whitespace-pre-wrap">
        {code}
      </code>
    </div>
  );
}
