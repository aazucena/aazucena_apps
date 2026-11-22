/**
 * NavigationButton Component
 * Split button with dropdown for section navigation
 * Used in HeroSection for primary CTA
 */

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button, IconRenderer } from "@aazucena/ui";
import { ChevronDown } from "@aazucena/icons";
import { cn } from "@aazucena/utils";
import type { IconComponent } from "@aazucena/types";
import { usePortfolio } from "@aazucena/context";

export interface NavigationDropdownOption {
  label: string;
  index: number;
  icon?: IconComponent;
}

export interface NavigationButtonProps {
  options: NavigationDropdownOption[];
  onNavigateClick?: (_index: number) => void;
  children?: React.ReactNode;
  dropdown?: boolean;
}

export function NavigationButton({
  dropdown = true,
  options,
  onNavigateClick,
  children,
}: NavigationButtonProps): JSX.Element {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLDivElement>(null);

  const { navigateToSection } = usePortfolio();

  const handleToggleDropdown = () => {
    const newState = !showDropdown;

    // Calculate position immediately when opening
    if (newState && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const style = {
        position: "fixed" as const,
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      };
      setDropdownStyle(style);
    }

    setShowDropdown(newState);
  };

  const onNavigate = (sectionIndex: number) => {
    onNavigateClick?.(sectionIndex);
    navigateToSection(sectionIndex);
    setShowDropdown(false);
  };

  // Update dropdown position on scroll/resize
  useEffect(() => {
    if (!showDropdown || !buttonRef.current) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const style = {
          position: "fixed" as const,
          top: `${rect.bottom + 8}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
        };
        setDropdownStyle(style);
      }
    };

    // Update on scroll and resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showDropdown]);

  // Guard against empty options array
  if (!options || options.length === 0) {
    return <></>;
  }

  const firstOptionIndex = options[0]!.index;
  const otherOptions = options.slice(1);

  // Auto-enable dropdown if there are multiple options, unless explicitly disabled
  const shouldShowDropdown = dropdown !== false && otherOptions.length > 0;
  const hasDropdownItems = shouldShowDropdown;

  return (
    <div ref={buttonRef} className="relative w-full sm:w-auto">
      <div className="flex w-full sm:w-auto">
        {/* Main Button */}
        <Button
          onClick={() => onNavigate(firstOptionIndex)}
          className={cn(
            "h-control-lg flex-1 px-5 sm:flex-none sm:px-6",
            hasDropdownItems && "rounded-r-none",
          )}
          aria-label="Get started"
        >
          {children ?? "Get Started"}
        </Button>

        {/* Dropdown Trigger - only show if dropdown prop is true AND there are items */}
        {hasDropdownItems && (
          <Button
            onClick={handleToggleDropdown}
            className="border-signal-foreground/30 h-control-lg flex-shrink-0 rounded-l-none border-l px-3"
            aria-label="Show navigation options"
            aria-expanded={showDropdown}
            aria-haspopup="menu"
          >
            <ChevronDown aria-hidden />
          </Button>
        )}
      </div>

      {/* Backdrop to close dropdown - Rendered via Portal */}
      {hasDropdownItems &&
        showDropdown &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setShowDropdown(false)}
          />,
          document.body,
        )}

      {/* Dropdown Menu - Rendered via Portal to bypass overflow issues */}
      {hasDropdownItems &&
        showDropdown &&
        typeof document !== "undefined" &&
        (() => {
          const dropdownElement = (
            <div
              style={dropdownStyle}
              className="dark bg-panel border-rule-strong rounded-card z-[500] max-h-[216px] overflow-y-auto border sm:min-w-[280px]"
            >
              {otherOptions.map((option) => {
                return (
                  <button
                    key={option.index}
                    onClick={() => onNavigate(option.index)}
                    className="border-rule text-foreground hover:bg-state focus-visible:outline-signal flex w-full items-center gap-2 border-b px-4 py-2 text-left transition-colors duration-(--motion-base) last:border-b-0 focus-visible:outline-1 focus-visible:-outline-offset-2 sm:gap-3 sm:px-6 sm:py-3"
                  >
                    <IconRenderer
                      icon={option.icon}
                      className="text-signal h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
                    />
                    <span className="text-sm font-medium sm:text-base">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          );
          return createPortal(dropdownElement, document.body);
        })()}
    </div>
  );
}
