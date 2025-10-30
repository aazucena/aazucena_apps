/**
 * Preloader Theme Examples
 *
 * This file demonstrates how to use the various theme variants
 * and custom theme configurations with the Preloader component.
 */

import Preloader from '../Preloader';
import InteractivePreloader from '../InteractivePreloader';
import SimplePreloader from '../SimplePreloader';

// Example 1: Basic Theme Usage
export function HoyoversePreloader() {
  return (
    <InteractivePreloader
      theme="hoyoverse"
      title="Entering Teyvat..."
      readyTitle="Welcome, Traveler!"
      readySubtitle="Your journey begins now"
      continueButtonText="Begin Adventure"
      enableAnimations={true}
      onComplete={() => console.log('Ready to explore!')}
    />
  );
}

// Example 2: Cyberpunk Theme
export function CyberpunkPreloader() {
  return (
    <Preloader
      variant="interactive"
      theme="cyberpunk"
      title="INITIALIZING SYSTEM"
      subtitle="NEURAL NETWORK LOADING..."
      readyTitle="SYSTEM ONLINE"
      continueButtonText="JACK IN"
    />
  );
}

// Example 3: Minimal Theme
export function MinimalPreloader() {
  return (
    <SimplePreloader
      theme="minimal"
      title="Loading Portfolio"
      readyTitle="Ready"
      continueButtonText="Enter"
      enableAnimations={false}
    />
  );
}

// Example 4: Glass Theme
export function GlassPreloader() {
  return (
    <InteractivePreloader
      theme="glass"
      title="Loading Experience"
      readyTitle="All Set!"
      readySubtitle="Your content is ready to view"
      continueButtonText="Let's Go"
    />
  );
}

// Example 5: Nature Theme
export function NaturePreloader() {
  return (
    <InteractivePreloader
      theme="nature"
      title="Growing Your Garden"
      readyTitle="Blooming Complete!"
      readySubtitle="Your organic experience is ready"
      continueButtonText="Explore Nature"
    />
  );
}

// Example 6: Custom Theme Override
export function CustomBrandPreloader() {
  return (
    <InteractivePreloader
      theme="default"
      customTheme={{
        colors: {
          primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          success: 'rgb(99, 102, 241)',
          accent: 'rgb(236, 72, 153)',
        },
        effects: {
          glowColor: 'rgba(102, 126, 234, 0.5)',
          borderRadius: {
            card: '1.5rem',
            button: '0.75rem',
            badge: '9999px',
            progress: '9999px',
          },
        },
      }}
      title="Loading Your App"
      readyTitle="Ready to Go!"
      continueButtonText="Get Started"
    />
  );
}

// Example 7: Full Custom Theme
export function FullyCustomPreloader() {
  return (
    <InteractivePreloader
      theme="default"
      customTheme={{
        colors: {
          primary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          primaryForeground: 'rgb(255, 255, 255)',
          secondary: 'rgb(100, 116, 139)',
          secondaryForeground: 'rgb(255, 255, 255)',
          success: 'rgb(34, 197, 94)',
          successForeground: 'rgb(255, 255, 255)',
          error: 'rgb(239, 68, 68)',
          errorForeground: 'rgb(255, 255, 255)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cardBackground: 'rgba(255, 255, 255, 0.1)',
          overlayBackground: 'rgba(102, 126, 234, 0.9)',
          foreground: 'rgb(255, 255, 255)',
          mutedForeground: 'rgba(255, 255, 255, 0.7)',
          accent: 'rgb(236, 72, 153)',
          accentForeground: 'rgb(255, 255, 255)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
        effects: {
          backdropBlur: 'blur(20px)',
          cardBlur: 'blur(24px)',
          shadow: '0 25px 50px rgba(102, 126, 234, 0.4)',
          glowColor: 'rgba(245, 87, 108, 0.6)',
          borderRadius: {
            card: '2rem',
            button: '1rem',
            badge: '9999px',
            progress: '9999px',
          },
          animationSpeed: 1.3,
          animationEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
        typography: {
          titleSize: '2rem',
          titleWeight: '800',
          subtitleSize: '1rem',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
      title="Welcome to the Future"
      readyTitle="Let's Begin!"
      readySubtitle="Everything is ready for you"
      continueButtonText="Launch Experience"
    />
  );
}

// Example 8: Dark Mode with Light Accents
export function DarkModePreloader() {
  return (
    <InteractivePreloader
      theme="dark"
      title="Loading Dashboard"
      readyTitle="Dashboard Ready"
      readySubtitle="All your data is loaded"
      continueButtonText="View Dashboard"
      debug={true}
    />
  );
}

// Example 9: Light Theme for Light Mode
export function LightModePreloader() {
  return (
    <SimplePreloader
      theme="light"
      title="Getting Things Ready"
      readyTitle="All Done!"
      readySubtitle="Your workspace is prepared"
      continueButtonText="Start Working"
    />
  );
}

// Example 10: Simple with Hoyoverse Theme
export function SimpleHoyoversePreloader() {
  return (
    <SimplePreloader
      theme="hoyoverse"
      title="Loading..."
      readyTitle="Ready!"
      continueButtonText="Continue"
    />
  );
}

// Example 11: With Custom Steps and Theme
export function CustomStepsWithTheme() {
  return (
    <InteractivePreloader
      theme="cyberpunk"
      customSteps={[
        {
          id: 1,
          name: 'Connecting',
          description: 'Establishing secure connection...',
          icon: () => <div>🔌</div>,
        },
        {
          id: 2,
          name: 'Authenticating',
          description: 'Verifying credentials...',
          icon: () => <div>🔐</div>,
        },
        {
          id: 3,
          name: 'Loading Data',
          description: 'Fetching your data...',
          icon: () => <div>📦</div>,
        },
      ]}
      title="SYSTEM BOOT"
      readyTitle="CONNECTION ESTABLISHED"
      continueButtonText="PROCEED"
    />
  );
}

// Example 12: Conditional Theme Based on Time of Day
export function TimeBasedThemePreloader() {
  const hour = new Date().getHours();
  const isDayTime = hour >= 6 && hour < 18;

  return (
    <InteractivePreloader
      theme={isDayTime ? 'light' : 'dark'}
      title="Loading Your Experience"
      readyTitle="Welcome!"
      continueButtonText="Continue"
    />
  );
}
