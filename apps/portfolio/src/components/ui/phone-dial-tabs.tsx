"use client"

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { cn } from '../../lib/utils';

export interface PhoneDialTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  gradient: string;
  content: React.ReactNode;
}

interface PhoneDialTabsProps {
  tabs: PhoneDialTab[];
  defaultTab?: string;
  className?: string;
}

export function PhoneDialTabs({ tabs, defaultTab, className }: PhoneDialTabsProps) {
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

  // Calculate angle step between each tab
  const angleStep = 180 / (totalTabs - 1); // 180 degrees divided by number of gaps

  // Calculate position for each tab in semicircle with rotation
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

  // Get the angle from center to a point
  const getAngleFromCenter = (clientX: number, clientY: number): number => {
    if (!wheelRef.current) return 0;

    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    return angle;
  };

  // Trigger haptic feedback
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  // Play click sound
  const playClickSound = () => {
    // Create a subtle click sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  };

  // Snap to a specific tab index with phone dial animation
  const snapToTabIndex = (targetIndex: number, immediate = false) => {
    const clampedIndex = Math.max(0, Math.min(totalTabs - 1, targetIndex));
    const targetRotation = -clampedIndex * angleStep;

    // Kill any existing rotation tween
    if (rotationTweenRef.current) {
      rotationTweenRef.current.kill();
    }

    if (immediate) {
      setRotation(targetRotation);
      setCurrentStepIndex(clampedIndex);
      setActiveTab(tabs[clampedIndex]!.id);
    } else {
      rotationTweenRef.current = gsap.to({ value: rotation }, {
        value: targetRotation,
        duration: 0.4,
        ease: 'back.out(2)',
        onUpdate: function() {
          setRotation(this.targets()[0].value);
        },
        onComplete: () => {
          setCurrentStepIndex(clampedIndex);
          setActiveTab(tabs[clampedIndex]!.id);
          rotationTweenRef.current = null;
        }
      });
    }
  };

  // Mouse/Touch handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      rotation: rotation,
      stepIndex: currentStepIndex
    };
    lastAngleRef.current = getAngleFromCenter(clientX, clientY);
    lastHapticStepRef.current = currentStepIndex;

    // Cancel any ongoing animations
    if (rotationTweenRef.current) {
      rotationTweenRef.current.kill();
      rotationTweenRef.current = null;
    }
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const currentAngle = getAngleFromCenter(clientX, clientY);
    const angleDiff = currentAngle - lastAngleRef.current;

    // Handle angle wrap-around
    let adjustedDiff = angleDiff;
    if (angleDiff > 180) adjustedDiff -= 360;
    if (angleDiff < -180) adjustedDiff += 360;

    // Calculate new rotation with resistance
    const resistance = 0.6; // Add resistance to make it feel more mechanical
    const newRotation = rotation + (adjustedDiff * resistance);

    // Calculate which step we're at
    const stepFromRotation = Math.round(-newRotation / angleStep);
    const clampedStep = Math.max(0, Math.min(totalTabs - 1, stepFromRotation));

    // Snap to nearest step position (like phone dial notches)
    const snappedRotation = -clampedStep * angleStep;
    setRotation(snappedRotation);

    // Trigger haptic feedback when crossing a step
    if (clampedStep !== lastHapticStepRef.current) {
      triggerHaptic();
      playClickSound();
      lastHapticStepRef.current = clampedStep;
      setCurrentStepIndex(clampedStep);
      setActiveTab(tabs[clampedStep]!.id);
    }

    lastAngleRef.current = currentAngle;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to the current step with spring animation
    snapToTabIndex(currentStepIndex, false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleDragStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleDragMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Setup global event listeners
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
  }, [isDragging, rotation, currentStepIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rotationTweenRef.current) {
        rotationTweenRef.current.kill();
      }
    };
  }, []);

  // Animate tab content change
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleTabClick = (_tabId: string, index: number) => {
    if (isDragging) return;

    triggerHaptic();
    playClickSound();
    snapToTabIndex(index, false);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn('relative w-full', className)}>
      {/* Tabs Container - Semicircle Layout */}
      <div className="relative flex items-center justify-center mb-8 mt-16">
        <div
          ref={wheelRef}
          className={cn(
            'relative select-none touch-none overflow-visible',
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          )}
          style={{ width: '600px', height: '420px', minHeight: '420px' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background Arc Visual with Notches */}
          <svg
            className="absolute w-full h-full pointer-events-none"
            style={{ top: '0', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '400px' }}
            viewBox="0 0 500 400"
          >
            {/* Full circle background - dashed */}
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

            {/* Notches for active tabs (top half) */}
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
                  stroke={index === currentStepIndex ? 'rgba(34, 211, 238, 0.8)' : 'rgba(255, 255, 255, 0.3)'}
                  strokeWidth={index === currentStepIndex ? '3' : '2'}
                />
              );
            })}

            {/* Placeholder notches (bottom half) */}
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

            {/* Center circle indicator */}
            <circle
              cx="250"
              cy="200"
              r="8"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
            />
          </svg>

          {/* Placeholder Tab Dots (bottom half) */}
          {Array.from({ length: totalTabs }).map((_, index) => {
            // Calculate position for bottom half with rotation
            const baseAngle = 0 + (180 * index) / (totalTabs - 1);
            const angle = baseAngle + rotation;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius - 10;

            return (
              <div
                key={`placeholder-${index}`}
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-3 h-3 rounded-full bg-white/10 border border-white/20" />
              </div>
            );
          })}

          {/* Tab Buttons (top half - interactive) */}
          {tabs.map((tab, index) => {
            const { x, y } = getTabPosition(index, tabs.length, rotation);
            const isActive = index === currentStepIndex;

            return (
              <button
                key={tab.id}
                ref={el => { tabRefs.current[index] = el; }}
                onClick={() => handleTabClick(tab.id, index)}
                className={cn(
                  'absolute flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200',
                  'backdrop-blur-sm border pointer-events-auto',
                  isActive
                    ? `bg-gradient-to-br ${tab.gradient} border-white/40 shadow-lg shadow-cyan-500/20 scale-110`
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105'
                )}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  minWidth: '100px',
                  minHeight: '80px'
                }}
                aria-label={tab.label}
              >
                {tab.icon && (
                  <div className={cn(
                    'flex-shrink-0 transition-transform duration-200',
                    isActive ? 'text-white scale-110' : 'text-gray-400'
                  )}>
                    {tab.icon}
                  </div>
                )}
                <span className={cn(
                  'text-sm font-semibold text-center whitespace-nowrap',
                  isActive ? 'text-white' : 'text-gray-300'
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div ref={contentRef} className="w-full pt-4">
        {activeTabContent}
      </div>
    </div>
  );
}
