"use client";

import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelBody, PanelHeader } from "@aazucena/ui";
import { cn } from "@aazucena/utils";
import { usePrefersReducedMotion } from "@aazucena/hooks";

export interface PhoneDialTab {
  id: string;
  label: string;
  name: string;
  icon?: React.ReactNode;
  /** Number of items in the tab, shown in the content panel header when above zero. */
  count?: number;
  content: React.ReactNode;
}

interface PhoneDialTabsProps {
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
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
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
  // GSAP ignores the reduced-motion media query, so the dial jumps instead of turning
  const reduceMotion = usePrefersReducedMotion();

  const radius = 200;
  const totalTabs = tabs.length;

  // Calculate angle step between each tab
  const angleStep = 180 / (totalTabs - 1); // 180 degrees divided by number of gaps

  // Calculate position for each tab in semicircle with rotation
  const getTabPosition = (
    index: number,
    total: number,
    currentRotation: number,
  ) => {
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

    const angle =
      Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    return angle;
  };

  // Trigger haptic feedback
  const triggerHaptic = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  // Play click sound
  const playClickSound = () => {
    // Don't play sound if muted
    if (isSoundMuted) return;

    // Create a subtle click sound using Web Audio API
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.05,
    );

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

    if (immediate || reduceMotion) {
      setRotation(targetRotation);
      setCurrentStepIndex(clampedIndex);
      setActiveTab(tabs[clampedIndex]!.name);
    } else {
      rotationTweenRef.current = gsap.to(
        { value: rotation },
        {
          value: targetRotation,
          duration: 0.4,
          ease: "back.out(2)",
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
  };

  // Mouse/Touch handlers
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      rotation: rotation,
      stepIndex: currentStepIndex,
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
    const newRotation = rotation + adjustedDiff * resistance;

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
      setActiveTab(tabs[clampedStep]!.name);
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
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
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
        {
          opacity: 1,
          y: 0,
          duration: reduceMotion ? 0 : 0.5,
          ease: "power2.out",
        },
      );
    }
  }, [activeTab, reduceMotion]);

  const handleTabClick = (_tabId: string, index: number) => {
    if (isDragging) return;

    triggerHaptic();
    playClickSound();
    snapToTabIndex(index, false);
  };

  // const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  const activeTabContent = useMemo(() => {
    const tab = tabs.find((tab) => tab.name === activeTab);
    return tab?.content;
  }, [activeTab]);

  const activeTabLabel = (
    tabs.find((tab) => tab.name === activeTab)?.label ?? ""
  ).toUpperCase();

  const activeTabCount = tabs.find((tab) => tab.name === activeTab)?.count ?? 0;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Tabs Container - Semicircle Layout */}
      <div className="relative mt-16 mb-8 flex items-center justify-center">
        <div
          ref={wheelRef}
          className={cn(
            "relative touch-none overflow-visible select-none",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          style={{ width: "600px", height: "420px", minHeight: "420px" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Background Arc Visual with Notches */}
          <svg
            className="pointer-events-none absolute h-full w-full"
            style={{
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "500px",
              height: "400px",
            }}
            viewBox="0 0 500 400"
          >
            {/* Full circle background - dashed */}
            <circle
              cx="250"
              cy="200"
              r="200"
              className="stroke-rule-strong fill-none"
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
                  className={
                    index === currentStepIndex
                      ? "stroke-signal"
                      : "stroke-rule-strong"
                  }
                  strokeWidth={index === currentStepIndex ? "3" : "2"}
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
                  className="stroke-rule"
                  strokeWidth="1"
                />
              );
            })}

            {/* Center circle indicator */}
            <circle
              cx="250"
              cy="200"
              r="8"
              className="fill-state stroke-rule-strong"
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
                className="pointer-events-none absolute flex items-center justify-center"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="border-rule bg-state h-3 w-3 rounded-full border" />
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
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleTabClick(tab.id, index)}
                className={cn(
                  "rounded-card absolute flex flex-col items-center justify-center gap-2 p-4 transition-[transform,background-color,border-color] duration-(--motion-base)",
                  "focus-visible:outline-signal pointer-events-auto border focus-visible:outline-1 focus-visible:outline-offset-2",
                  isActive
                    ? "border-signal bg-state scale-110"
                    : "border-rule bg-panel hover:border-rule-strong hover:bg-state hover:scale-105",
                )}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                  minWidth: "100px",
                  minHeight: "80px",
                }}
                aria-label={tab.label}
                aria-pressed={isActive}
              >
                {tab.icon && (
                  <div
                    className={cn(
                      "flex-shrink-0 transition-transform duration-200",
                      isActive
                        ? "text-signal scale-110"
                        : "text-muted-foreground",
                    )}
                  >
                    {tab.icon}
                  </div>
                )}
                <span
                  className={cn(
                    "micro-label text-center whitespace-nowrap",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="micro-label text-muted-foreground -mt-4 mb-4 text-center">
        Drag or pick a domain
      </p>

      {/* Tab Content */}
      <div ref={contentRef} className="w-full pt-4">
        <Panel
          role="region"
          aria-label={`STACK // ${activeTabLabel}`}
          className="border-rule border"
        >
          <PanelHeader label={`STACK // ${activeTabLabel}`}>
            {activeTabCount > 0 && (
              <span className="micro-label text-signal">
                {activeTabCount} {activeTabCount === 1 ? "TOOL" : "TOOLS"}
              </span>
            )}
          </PanelHeader>
          <PanelBody>{activeTabContent}</PanelBody>
        </Panel>
      </div>
    </div>
  );
}
