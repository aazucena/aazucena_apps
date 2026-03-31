import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@aazucena/utils';
import { Button } from '@aazucena/ui';
import { useEasterEggChallenge } from '../hooks/useEasterEggChallenge';

export interface FormStep {
  id: string;
  title: string;
  component: React.ReactNode;
  isValid?: boolean;
}

export interface FormWizardProps {
  steps: FormStep[];
  onComplete: () => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
  showChallenge?: boolean;
}

/**
 * FormWizard
 * A reusable multi-step form orchestrator with built-in AI challenge support.
 */
export function FormWizard({
  steps,
  onComplete,
  isSubmitting = false,
  className,
  showChallenge = true,
}: FormWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { activeChallenge, isCompleted: isChallengeDone } = useEasterEggChallenge();

  const isLastStep = currentStepIndex === steps.length - 1;
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-12">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 z-10',
                idx <= currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {idx + 1}
            </div>
            <span className="text-[10px] uppercase tracking-widest mt-2 font-medium hidden md:block">
              {step.title}
            </span>
            {/* Line connector */}
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'absolute top-4 left-1/2 w-full h-[2px] -z-0 transition-all duration-500',
                  idx < currentStepIndex ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep?.component}

            {/* Injected AI Challenge before last step if enabled */}
            {showChallenge && isLastStep && !isChallengeDone && activeChallenge && (
              <div className="mt-8 p-6 rounded-2xl bg-accent/50 border border-primary/20 animate-pulse-subtle">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">
                  Security Verification: {activeChallenge.label}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">{activeChallenge.hint}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-yellow-600 dark:text-yellow-400">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                  Interaction Required to Unlock Submission
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-8 border-t border-border">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStepIndex === 0 || isSubmitting}
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={
            isSubmitting ||
            (isLastStep && showChallenge && !isChallengeDone) ||
            currentStep?.isValid === false
          }
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Processing...' : isLastStep ? 'Submit' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
}
