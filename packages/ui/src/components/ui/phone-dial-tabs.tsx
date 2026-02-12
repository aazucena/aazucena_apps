'use client';

import { gsap } from 'gsap';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { cn } from '@aazucena/utils';

export interface PhoneDialTab {
  id: string;
  label: string;
  name: string;
  icon?: React.ReactNode;
  gradient: string;
  content: React.ReactNode;
}

export interface PhoneDialTabsProps {
  tabs: PhoneDialTab[];
  defaultTab?: string;
  className?: string;
  isSoundMuted?: boolean;
}

export function PhoneDialTabs({
  tabs,
  defaultTab,
  className,
  isSoundMuted = false,
}: PhoneDialTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, rotation: 0, stepIndex: 0 });
  const lastAngleRef = useRef(0);
  const rotationTweenRef = useRef<gsap.core.Tween | null>(null);
  const lastHapticStepRef = useRef(0);

  const radius = 200;
  const totalTabs = tabs.length;

  const angleStep = 180 / (totalTabs - 1);

  const getTabPosition = (index: number, total: number, currentRotation: number) => {
    const startAngle = -180;
    const endAngle = 0;
    const angleRange = endAngle - startAngle;
    const baseAngle = startAngle + (angleRange * index) / (total - 1);
    const angle = baseAngle + currentRotation;
    const angleRad = (angle * Math.PI) / 180;

    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;

    return { x, y: y - 10, angle };
  };

  const getAngleFromCenter = useCallback((clientX: number, clientY: number): number => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    return angle;
  }, []);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const playClickSound = useCallback(() => {
    if (isSoundMuted || typeof window === 'undefined') return;

    try {
      const AudioContextClass = (window.AudioContext ||
        (window as any).webkitAudioContext) as typeof AudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch {
      // Audio context might be blocked
    }
  }, [isSoundMuted]);

  const snapToTabIndex = useCallback(
    (targetIndex: number, immediate = false) => {
      const clampedIndex = Math.max(0, Math.min(totalTabs - 1, targetIndex));
      const targetRotation = -clampedIndex * angleStep;

      if (rotationTweenRef.current) {
        rotationTweenRef.current.kill();
      }

      if (immediate) {
        setRotation(targetRotation);
        setCurrentStepIndex(clampedIndex);
        setActiveTab(tabs[clampedIndex]!.name);
      } else {
        rotationTweenRef.current = gsap.to(
          { value: rotation },
          {
            value: targetRotation,
            duration: 0.4,
            ease: 'back.out(2)',
            onUpdate: function () {
              setRotation(this.targets()[0].value);
            },
            onComplete: () => {
              setCurrentStepIndex(clampedIndex);
              setActiveTab(tabs[clampedIndex]!.name);
              rotationTweenRef.current = null;
            },
          },
        );
      }
    },
    [totalTabs, angleStep, rotation, tabs],
  );

  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      dragStartRef.current = {
        x: clientX,
        y: clientY,
        rotation: rotation,
        stepIndex: currentStepIndex,
      };
      lastAngleRef.current = getAngleFromCenter(clientX, clientY);
      lastHapticStepRef.current = currentStepIndex;

      if (rotationTweenRef.current) {
        rotationTweenRef.current.kill();
        rotationTweenRef.current = null;
      }
    },
    [rotation, currentStepIndex, getAngleFromCenter],
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;

      const currentAngle = getAngleFromCenter(clientX, clientY);
      const angleDiff = currentAngle - lastAngleRef.current;

      let adjustedDiff = angleDiff;
      if (angleDiff > 180) adjustedDiff -= 360;
      if (angleDiff < -180) adjustedDiff += 360;

      const resistance = 0.6;
      const newRotation = rotation + adjustedDiff * resistance;

      const stepFromRotation = Math.round(-newRotation / angleStep);
      const clampedStep = Math.max(0, Math.min(totalTabs - 1, stepFromRotation));

      const snappedRotation = -clampedStep * angleStep;
      setRotation(snappedRotation);

      if (clampedStep !== lastHapticStepRef.current) {
        triggerHaptic();
        playClickSound();
        lastHapticStepRef.current = clampedStep;
        setCurrentStepIndex(clampedStep);
        setActiveTab(tabs[clampedStep]!.name);
      }

      lastAngleRef.current = currentAngle;
    },
    [isDragging, rotation, angleStep, totalTabs, tabs, playClickSound, getAngleFromCenter],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToTabIndex(currentStepIndex, false);
  }, [isDragging, currentStepIndex, snapToTabIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    },
    [handleDragMove],
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleDragStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleDragMove(touch.clientX, touch.clientY);
      }
    },
    [handleDragMove],
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    return () => {
      if (rotationTweenRef.current) {
        rotationTweenRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      );
    }
  }, [activeTab]);

  const handleTabClick = (_tabId: string, index: number) => {
    if (isDragging) return;

    triggerHaptic();
    playClickSound();
    snapToTabIndex(index, false);
  };

  const activeTabContent = useMemo(() => {
    const tab = tabs.find((tab) => tab.name === activeTab);
    return tab?.content;
  }, [activeTab, tabs]);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative mt-16 mb-8 flex items-center justify-center">
        <div
          ref={wheelRef}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={totalTabs - 1}
          aria-valuenow={currentStepIndex}
          aria-label="Select a tab"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') snapToTabIndex(currentStepIndex + 1);
            if (e.key === 'ArrowLeft') snapToTabIndex(currentStepIndex - 1);
          }}
          className={cn(
            'relative touch-none overflow-visible rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-cyan-500',
            isDragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
          style={{ width: '600px', height: '420px', minHeight: '420px' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <svg
            className="pointer-events-none absolute h-full w-full"
            style={{
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '400px',
            }}
            viewBox="0 0 500 400"
          >
            <circle
              cx="250"
              cy="200"
              r="200"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
              strokeDasharray="6.28 6.28"
              strokeLinecap="butt"
            />

            {tabs.map((_, index) => {
              const baseAngle = -180 + (180 * index) / (totalTabs - 1);
              const angle = baseAngle + rotation;
              const angleRad = (angle * Math.PI) / 180;
              const innerRadius = 195;
              const outerRadius = 205;
              const x1 = 250 + Math.cos(angleRad) * innerRadius;
              const y1 = 200 + Math.sin(angleRad) * innerRadius;
              const x2 = 250 + Math.cos(angleRad) * outerRadius;
              const y2 = 200 + Math.sin(angleRad) * outerRadius;

              return (
                <line
                  key={`notch-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    index === currentStepIndex
                      ? 'rgba(34, 211, 238, 0.8)'
                      : 'rgba(255, 255, 255, 0.3)'
                  }
                  strokeWidth={index === currentStepIndex ? '3' : '2'}
                />
              );
            })}

            {Array.from({ length: totalTabs }).map((_, index) => {
              const baseAngle = 0 + (180 * index) / (totalTabs - 1);
              const angle = baseAngle + rotation;
              const angleRad = (angle * Math.PI) / 180;
              const innerRadius = 195;
              const outerRadius = 205;
              const x1 = 250 + Math.cos(angleRad) * innerRadius;
              const y1 = 200 + Math.sin(angleRad) * innerRadius;
              const x2 = 250 + Math.cos(angleRad) * outerRadius;
              const y2 = 200 + Math.sin(angleRad) * outerRadius;

              return (
                <line
                  key={`placeholder-notch-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              );
            })}

            <circle
              cx="250"
              cy="200"
              r="8"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
            />
          </svg>

          {Array.from({ length: totalTabs }).map((_, index) => {
            const baseAngle = 0 + (180 * index) / (totalTabs - 1);
            const angle = baseAngle + rotation;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius - 10;

            return (
              <div
                key={`placeholder-${index}`}
                className="pointer-events-none absolute flex items-center justify-center"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="h-3 w-3 rounded-full border border-white/20 bg-white/10" />
              </div>
            );
          })}

          {tabs.map((tab, index) => {
            const { x, y } = getTabPosition(index, tabs.length, rotation);
            const isActive = index === currentStepIndex;

            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleTabClick(tab.id, index)}
                className={cn(
                  'absolute flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all duration-200',
                  'pointer-events-auto border backdrop-blur-sm',
                  isActive
                    ? `bg-gradient-to-br ${tab.gradient} scale-110 border-white/40 shadow-lg shadow-cyan-500/20`
                    : 'border-white/10 bg-white/5 hover:scale-105 hover:border-white/20 hover:bg-white/10',
                )}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  minWidth: '100px',
                  minHeight: '80px',
                }}
                aria-label={tab.label}
              >
                {tab.icon && (
                  <div
                    className={cn(
                      'flex-shrink-0 transition-transform duration-200',
                      isActive ? 'scale-110 text-white' : 'text-gray-400',
                    )}
                  >
                    {tab.icon}
                  </div>
                )}
                <span
                  className={cn(
                    'text-center text-sm font-semibold whitespace-nowrap',
                    isActive ? 'text-white' : 'text-gray-300',
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={contentRef} className="w-full pt-4">
        {activeTabContent}
      </div>
    </div>
  );
}
