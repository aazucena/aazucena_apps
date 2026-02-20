/**
 * NavigationButton Component
 * Split button with dropdown for section navigation
 * Used in HeroSection for primary CTA
 */

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconRenderer } from "~/components/blocks/IconRenderer";
import type { IconComponent } from "~/types/icons";
import { usePortfolio } from "~/contexts/animations";

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

  // Guard against empty options array
  if (!options || options.length === 0) {
    return <></>;
  }

  const firstOptionIndex = options[0]!.index;
  const otherOptions = options.slice(1);

  // Auto-enable dropdown if there are multiple options, unless explicitly disabled
  const shouldShowDropdown = dropdown !== false && otherOptions.length > 0;
  const hasDropdownItems = shouldShowDropdown;

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

  return (
    <div ref={buttonRef} className="relative w-full sm:w-auto">
      <div className="flex w-full sm:w-auto">
        {/* Main Button */}
        <button
          onClick={() => onNavigate(firstOptionIndex)}
          className={`focus:ring-opacity-50 flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-cyan-500/25 hover:brightness-110 focus:ring-2 focus:ring-cyan-400 focus:outline-none sm:flex-none ${hasDropdownItems ? "rounded-l-lg" : "rounded-lg"}`}
          aria-label="Get started"
        >
          {children ?? "Get Started"}
        </button>

        {/* Dropdown Trigger - only show if dropdown prop is true AND there are items */}
        {hasDropdownItems && (
          <button
            onClick={handleToggleDropdown}
            className="focus:ring-opacity-50 flex-shrink-0 rounded-r-lg border-l border-white/20 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-cyan-500/25 hover:brightness-110 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            aria-label="Show navigation options"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
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
              className="scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-gray-800 z-[500] max-h-[216px] overflow-y-auto rounded-lg border border-cyan-400/30 bg-gray-900 shadow-2xl sm:min-w-[280px]"
            >
              {otherOptions.map((option) => {
                return (
                  <button
                    key={option.index}
                    onClick={() => onNavigate(option.index)}
                    className="flex w-full items-center gap-3 border-b border-white/10 px-6 py-3 text-left text-white transition-colors duration-200 last:border-b-0 hover:bg-cyan-500/20"
                  >
                    <IconRenderer
                      icon={option.icon}
                      className="h-5 w-5 flex-shrink-0 text-cyan-400"
                    />
                    <span className="font-medium">{option.label}</span>
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
