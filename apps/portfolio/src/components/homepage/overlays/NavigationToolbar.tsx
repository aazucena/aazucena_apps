/**
 * NavigationToolbar Component
 * Self-contained navigation toolbar with integrated Info, Settings, and Social panels
 * Encapsulates all toolbar state management, panel rendering, and button layout
 *
 * Location: Co-located with UIOverlays in overlays/ directory due to tight coupling
 * with the overlay system and atmospheric phase functionality
 *
 * Note: This component merges the previous Toolbar component directly into the layout
 * to eliminate unnecessary component nesting (Toolbar was only used here)
 */

import type { JSX } from "react";
import {
  SocialMenu,
  SettingsPanel,
  InfoPanel,
  ToolbarButton,
} from "~/components/ui";
import { Popover } from "~/components/ui/common";
import type { AtmosphericPhase } from "~/config/animations";
import { usePortfolio, useAnimation } from "@aazucena/context";
import { usePortfolioData } from "~/contexts/animations";

export interface NavigationToolbarProps {
  /** Current atmospheric phase for Info panel */
  currentPhase: AtmosphericPhase;
}

/**
 * Integrated navigation toolbar with panel management
 * Handles all toolbar interactions and popover state internally
 */
export function NavigationToolbar({
  currentPhase,
}: NavigationToolbarProps): JSX.Element {
  // Portfolio context - panel visibility state
  const { showInfoPanel, showSettingsPanel, showSocialMenu, togglePanel } =
    usePortfolio();

  // Animation context - sound and device capabilities
  const { isSoundMuted, toggleSound, capabilities, updateCapabilities } =
    useAnimation();

  // Portfolio data - social links, email, etc.
  const portfolioData = usePortfolioData();

  return (
    <>
      {/* Navigation Toolbar - HoYoverse-inspired design */}
      <div className="fixed top-8 right-8 z-50 flex flex-row gap-4 rounded-full border border-white/20 bg-black/30 px-4 py-3 backdrop-blur-md">
        {/* Sound Toggle */}
        <ToolbarButton
          onClick={toggleSound}
          label={isSoundMuted ? "Unmute" : "Mute"}
          isActive={!isSoundMuted}
          className={
            isSoundMuted
              ? "border-red-400/40 bg-red-500/20 hover:border-red-400/60 hover:bg-red-500/30"
              : ""
          }
          icon={
            isSoundMuted ? (
              <svg
                className="h-6 w-6 text-red-400 transition-colors group-hover:text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-cyan-400 transition-colors group-hover:text-cyan-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )
          }
        />

        {/* Info Button */}
        <ToolbarButton
          onClick={() => togglePanel("info")}
          label="Information"
          isActive={showInfoPanel}
          icon={
            <svg
              className="h-6 w-6 text-white/80 transition-colors group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        {/* Settings Button */}
        <ToolbarButton
          onClick={() => togglePanel("settings")}
          label="Settings"
          isActive={showSettingsPanel}
          icon={
            <svg
              className="h-6 w-6 text-white/80 transition-colors group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />

        {/* Social Media Button */}
        <ToolbarButton
          onClick={() => togglePanel("social")}
          label="Social Links"
          isActive={showSocialMenu}
          icon={
            <svg
              className="h-6 w-6 text-white/80 transition-colors group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          }
        />
      </div>

      {/* Info Panel Popover */}
      <Popover
        isOpen={showInfoPanel}
        onClose={() => togglePanel("info")}
        position="top-right"
        width="320px"
      >
        <InfoPanel
          onClose={() => togglePanel("info")}
          currentPhase={currentPhase}
        />
      </Popover>

      {/* Settings Panel Popover */}
      <Popover
        isOpen={showSettingsPanel}
        onClose={() => togglePanel("settings")}
        position="top-right"
        width="320px"
      >
        <SettingsPanel
          onClose={() => togglePanel("settings")}
          capabilities={capabilities}
          onUpdateCapabilities={updateCapabilities}
        />
      </Popover>

      {/* Social Menu Popover */}
      <Popover
        isOpen={showSocialMenu}
        onClose={() => togglePanel("social")}
        position="top-right"
        width="320px"
      >
        <SocialMenu
          onClose={() => togglePanel("social")}
          socialLinks={portfolioData.socialLinks}
          email={portfolioData.email}
          emailDescription={portfolioData.emailDescription}
        />
      </Popover>
    </>
  );
}
