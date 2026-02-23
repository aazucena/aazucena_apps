'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'; // Assuming Dialog components are available
import { Checkbox } from './checkbox'; // Assuming Checkbox is available

const consentManagerVariants = cva(
  'fixed bottom-0 left-0 right-0 z-[100] flex flex-col gap-4 border-t bg-background p-4 shadow-lg transition-transform duration-300 ease-out data-[state=closed]:translate-y-full data-[state=open]:translate-y-0',
  {
    variants: {
      variant: {
        default: 'border-border',
        glass: 'glass border-border/20 backdrop-blur-sm',
        cyber:
          'bg-background/40 dark:bg-black/40 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] text-cyan-400',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  required?: boolean;
  checked?: boolean; // For initial state or customization
}

export interface ConsentManagerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof consentManagerVariants> {
  appName: string;
  policyLink: string;
  categories: ConsentCategory[];
  storageKey?: string; // Key for local storage
  onConsentChange?: (consent: Record<string, boolean>) => void;
}

const ConsentManager = React.forwardRef<HTMLDivElement, ConsentManagerProps>(
  (
    {
      appName,
      policyLink,
      categories: initialCategories,
      storageKey = 'app_consent_preferences',
      onConsentChange,
      className,
      variant,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [preferences, setPreferences] = React.useState<Record<string, boolean>>({});
    const [isCustomizing, setIsCustomizing] = React.useState(false);

    React.useEffect(() => {
      // Load preferences from local storage
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const loadedPreferences = JSON.parse(stored);
        setPreferences(loadedPreferences);
        // If consent is already given, do not open the banner
        if (Object.values(loadedPreferences).some(val => val)) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      } else {
        // No preferences stored, show banner
        setIsOpen(true);
      }
    }, [storageKey]);

    React.useEffect(() => {
      // Initialize preferences from initialCategories, prioritizing required ones
      const initialPrefs: Record<string, boolean> = {};
      initialCategories.forEach(cat => {
        initialPrefs[cat.id] = cat.required || cat.checked || false;
      });
      setPreferences(prev => ({ ...initialPrefs, ...prev }));
    }, [initialCategories]);

    const savePreferences = (prefs: Record<string, boolean>) => {
      localStorage.setItem(storageKey, JSON.stringify(prefs));
      setPreferences(prefs);
      onConsentChange?.(prefs);
    };

    const handleAcceptAll = () => {
      const allAccepted: Record<string, boolean> = {};
      initialCategories.forEach(cat => (allAccepted[cat.id] = true));
      savePreferences(allAccepted);
      setIsOpen(false);
      setIsCustomizing(false);
    };

    const handleRejectAll = () => {
      const allRejected: Record<string, boolean> = {};
      initialCategories.forEach(cat => (allRejected[cat.id] = cat.required || false)); // Keep required ones
      savePreferences(allRejected);
      setIsOpen(false);
      setIsCustomizing(false);
    };

    const handleSaveCustom = () => {
      savePreferences(preferences);
      setIsOpen(false);
      setIsCustomizing(false);
    };

    const handleToggleCategory = (id: string, checked: boolean) => {
      setPreferences(prev => ({ ...prev, [id]: checked }));
    };

    if (!isOpen && !isCustomizing) return null; // Render nothing if closed and not customizing

    return (
      <>
        {/* Consent Banner */}
        {isOpen && !isCustomizing && (
          <div
            ref={ref}
            className={cn(consentManagerVariants({ variant }), className)}
            data-state={isOpen ? 'open' : 'closed'}
            {...props}
          >
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm">
                We use cookies and other tracking technologies to improve your browsing experience on our website, to show you personalized content and targeted ads, to analyze our website traffic, and to understand where our visitors are coming from. By browsing our website, you consent to our use of cookies and other tracking technologies. Check our{' '}
                <a href={policyLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Privacy Policy
                </a>{' '}
                for more details.
              </p>
              <div className="flex shrink-0 flex-col gap-2 md:flex-row">
                <Button onClick={handleAcceptAll} className="w-full md:w-auto">
                  Accept All
                </Button>
                <Button onClick={() => setIsCustomizing(true)} variant="outline" className="w-full md:w-auto">
                  Customize
                </Button>
                <Button onClick={handleRejectAll} variant="secondary" className="w-full md:w-auto">
                  Reject All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Customization Dialog */}
        <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize Consent</DialogTitle>
              <DialogDescription>
                Manage your consent preferences for {appName}. You can change these settings at any time.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {initialCategories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={preferences[category.id]}
                    onCheckedChange={(checked) => handleToggleCategory(category.id, checked === true)}
                    disabled={category.required}
                  />
                  <label htmlFor={category.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {category.name} {category.required && '(Required)'}
                  </label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={handleSaveCustom}>Save Preferences</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
);
ConsentManager.displayName = 'ConsentManager';

export { ConsentManager, consentManagerVariants };
