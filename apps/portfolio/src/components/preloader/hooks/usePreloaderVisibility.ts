import { useState, useEffect, useRef } from 'react';

export interface UsePreloaderVisibilityOptions {
  lazyLoad?: boolean;
  onSkip?: () => void;
  onComplete?: () => void;
}

export interface UsePreloaderVisibilityReturn {
  isVisible: boolean;
  isInViewport: boolean;
  userSkipped: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleSkip: () => void;
  handleContinue: () => void;
  setIsVisible: (visible: boolean) => void;
}

export function usePreloaderVisibility({
  lazyLoad = false,
  onSkip,
  onComplete,
}: UsePreloaderVisibilityOptions): UsePreloaderVisibilityReturn {
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const [isInViewport, setIsInViewport] = useState(!lazyLoad);
  const [userSkipped, setUserSkipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy loading intersection observer
  useEffect(() => {
    if (!lazyLoad || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [lazyLoad]);

  const handleSkip = () => {
    setUserSkipped(true);
    setIsVisible(false);
    onSkip?.();
    onComplete?.();
  };

  const handleContinue = () => {
    setIsVisible(false);
    onComplete?.();
    document.dispatchEvent(new CustomEvent('preloader-complete'));
  };

  return {
    isVisible,
    isInViewport,
    userSkipped,
    containerRef,
    handleSkip,
    handleContinue,
    setIsVisible,
  };
}
