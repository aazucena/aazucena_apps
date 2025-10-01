import { useState, useRef, useEffect, useCallback } from 'react';
import type { LoadingStep } from '../types';

export function useLoadingProgress(
  minDisplayTime: number = 1500,
  customSteps?: LoadingStep[],
  onStepComplete?: (stepId: number, stepName: string) => void,
  animationDuration: number = 600
) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadTime, setLoadTime] = useState<string>('0.0');
  const [stepStatus, setStepStatus] = useState<Record<number, boolean>>({});
  const [hasReached100, setHasReached100] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startTime = useRef<number>(0);
  const hasStarted = useRef(false);
  const stepsRef = useRef(customSteps || []);

  // Update steps ref when customSteps changes
  useEffect(() => {
    stepsRef.current = customSteps || [];
  }, [customSteps]);

  // Memoize the loading function to prevent recreation
  const runLoadingSequence = useCallback(async () => {
    if (hasStarted.current || stepsRef.current.length === 0) return;

    hasStarted.current = true;
    startTime.current = performance.now();
    setProgress(0);
    setCurrentStep(0);
    setStepStatus({});
    setIsReady(false);
    setHasReached100(false);
    setError(null);

    try {
    const steps = stepsRef.current;
    const totalSteps = steps.length;

    // Start at 0% with brief display
    setProgress(0);
    await new Promise(resolve => setTimeout(resolve, 100));

      for (let i = 0; i < totalSteps; i++) {
        const step = steps[i]!;
        setCurrentStep(i);

        // Calculate target progress for this step
        const targetProgress = Math.floor(((i + 1) / totalSteps) * 100);

        // Set intermediate progress before the step (shows movement)
        const intermediateProgress = Math.floor((i / totalSteps) * 100) + 10;
        setProgress(intermediateProgress);

        // Execute the step
        if (step.check) {
          try {
            await step.check();
            setStepStatus(prev => ({ ...prev, [step.id]: true }));
            onStepComplete?.(step.id, step.name);
          } catch (error) {
            console.warn(`Error in step "${step.name}":`, error);
            setError(error as Error);
          }
        } else {
          setStepStatus(prev => ({ ...prev, [step.id]: true }));
          onStepComplete?.(step.id, step.name);
        }

        // Set final progress for this step
        setProgress(targetProgress);

        // Wait between steps
        if (i < totalSteps - 1) {
          await new Promise(resolve => setTimeout(resolve, animationDuration));
        }
      }

      // Set to 100% and mark completion
      setProgress(100);
      setHasReached100(true);

      // Wait at 100% before transition
      await new Promise(resolve => setTimeout(resolve, 800));

      // Ensure minimum total display time
      const elapsed = performance.now() - startTime.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      const finalLoadTime = ((performance.now() - startTime.current) / 1000).toFixed(1);
      setLoadTime(finalLoadTime);
      setIsReady(true);

    } catch (error) {
      console.error('Loading simulation failed:', error);
      setError(error as Error);
      // Emergency completion
      setProgress(100);
      setHasReached100(true);
      setLoadTime('0.0');
      setIsReady(true);
    }
  }, [minDisplayTime, onStepComplete, animationDuration]);

  // Manual start function
  const startLoading = useCallback(() => {
    runLoadingSequence();
  }, [runLoadingSequence]);

  // Reset function
  const resetLoading = useCallback(() => {
    hasStarted.current = false;
    setProgress(0);
    setCurrentStep(0);
    setStepStatus({});
    setIsReady(false);
    setHasReached100(false);
    setLoadTime('0.0');
    setError(null);
  }, []);

  return {
    progress,
    currentStep,
    isReady,
    loadTime,
    stepStatus,
    steps: stepsRef.current,
    hasReached100,
    error,
    startLoading,
    resetLoading,
    isLoading: hasStarted.current && !isReady,
  };
}
