/**
 * NavigationToolbar Component
 * Mobile: collapsible pill with hamburger toggle (centered top)
 * Desktop: full pill always visible (top-right)
 */

import type { JSX } from "react";
import React, { useState, useEffect } from "react";
import { SocialMenu, SettingsPanel, InfoPanel } from "~/components/ui";
import { ToolbarButton } from "@aazucena/ui";
import { Popover } from "~/components/ui/common";
import type { AtmosphericPhase } from "@aazucena/types";
import { usePortfolio, useAnimation } from "@aazucena/context";
import { usePortfolioData } from "~/contexts";
import { cn } from "@aazucena/utils";

export interface NavigationToolbarProps {
  currentPhase: AtmosphericPhase;
}

export function NavigationToolbar({
  currentPhase,
}: NavigationToolbarProps): JSX.Element {
  const { showInfoPanel, showSettingsPanel, showSocialMenu, togglePanel } =
    usePortfolio();
  const { isSoundMuted, toggleSound, capabilities, updateCapabilities } =
    useAnimation();
  const portfolioData = usePortfolioData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSoundHint, setShowSoundHint] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("portfolio-sound-hint-seen")) {
        const show = setTimeout(() => setShowSoundHint(true), 2500);
        const hide = setTimeout(() => {
          setShowSoundHint(false);
          sessionStorage.setItem("portfolio-sound-hint-seen", "true");
        }, 7000);
        return () => {
          clearTimeout(show);
          clearTimeout(hide);
        };
      }
    } catch (_) {}
  }, []);

  // Shared button set — rendered in both mobile and desktop toolbars
  const buttons = (
    <>
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
    </>
  );

  return (
    <>
      {/* ── Mobile: collapsible pill (centered top) ── */}
      <div className="fixed top-6 right-4 z-50 md:hidden">
        <div className="relative flex flex-row items-center rounded-full border border-white/20 bg-black/30 px-3.5 py-1 backdrop-blur-md">
          {/* Buttons expand to the LEFT of the toggle */}
          <div
            className={cn(
              "flex flex-row gap-3 overflow-hidden transition-all duration-300",
              isExpanded
                ? "mr-3 max-w-xs opacity-100"
                : "pointer-events-none max-w-0 opacity-0",
            )}
          >
            {buttons}
          </div>

          {/* Toggle — always pinned to the right */}
          <button
            onClick={() => setIsExpanded((v) => !v)}
            aria-label={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
            className="p-1.5"
          >
            <div className="flex h-6 w-6 flex-col items-center justify-center gap-1.5">
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-white/80 transition-all duration-300",
                  isExpanded && "translate-y-2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-white/80 transition-all duration-300",
                  isExpanded && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-5 rounded-full bg-white/80 transition-all duration-300",
                  isExpanded && "-translate-y-2 -rotate-45",
                )}
              />
            </div>
          </button>
        </div>
        {/* First-visit sound hint */}
        <div
          className={cn(
            "pointer-events-none absolute top-full right-0 mt-2 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-medium whitespace-nowrap text-white/70 backdrop-blur-md transition-all duration-500",
            isSoundMuted && showSoundHint
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0",
          )}
          aria-hidden="true"
        >
          <svg
            className="h-3 w-3 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          Ambient sound — tap ☰ to enable
        </div>
      </div>

      {/* ── Desktop: full pill always visible (top-right) ── */}
      <div className="fixed top-8 right-8 z-50 hidden md:block">
        <div className="flex flex-row gap-4 rounded-full border border-white/20 bg-black/30 px-4 py-3 backdrop-blur-md">
          {buttons}
        </div>
        {/* First-visit sound hint */}
        <div
          className={cn(
            "pointer-events-none absolute top-full right-0 mt-2 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-medium whitespace-nowrap text-white/70 backdrop-blur-md transition-all duration-500",
            isSoundMuted && showSoundHint
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0",
          )}
          aria-hidden="true"
        >
          <svg
            className="h-3 w-3 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
          Ambient sound — click 🔊 to enable
        </div>
      </div>

      {/* Popovers — shared, render as fixed overlays independent of toolbar */}
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
