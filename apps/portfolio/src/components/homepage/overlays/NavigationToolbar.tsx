/**
 * NavigationToolbar Component
 * Mobile: collapsible pill with hamburger toggle (centered top)
 * Desktop: full pill always visible (top-right)
 */

import type { JSX } from "react";
import React, { useState, useEffect, useRef } from "react";
import { SocialMenu, SettingsPanel, InfoPanel } from "~/components/ui";
import { Button } from "@aazucena/ui";
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
  const lastTrigger = useRef<HTMLElement | null>(null);
  const anyPanelOpen = showInfoPanel || showSettingsPanel || showSocialMenu;
  const wasOpen = useRef(false);

  // Focus returns to the control that opened the panel when it closes
  useEffect(() => {
    if (wasOpen.current && !anyPanelOpen) lastTrigger.current?.focus();
    wasOpen.current = anyPanelOpen;
  }, [anyPanelOpen]);

  const openPanel = (
    name: "info" | "settings" | "social",
    e: React.MouseEvent<HTMLElement>,
  ) => {
    lastTrigger.current = e.currentTarget;
    togglePanel(name);
  };

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
    } catch {
      // ignore — localStorage may be unavailable (e.g. private browsing)
    }
  }, []);

  const icon = (d: string | string[]) => (
    <svg
      className="size-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {(Array.isArray(d) ? d : [d]).map((p) => (
        <path
          key={p}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d={p}
        />
      ))}
    </svg>
  );

  const SPEAKER =
    "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z";

  const panelButton = (
    name: "info" | "settings" | "social",
    label: string,
    open: boolean,
    paths: string | string[],
  ) => (
    <Button
      type="button"
      size="icon"
      variant={open ? "cyber" : "secondary"}
      onClick={(e) => openPanel(name, e)}
      aria-label={label}
      aria-expanded={open}
      aria-haspopup="dialog"
      title={label}
    >
      {icon(paths)}
    </Button>
  );

  // Shared button set — rendered in both mobile and desktop toolbars
  const buttons = (
    <>
      <Button
        type="button"
        variant={isSoundMuted ? "secondary" : "cyber"}
        onClick={toggleSound}
        aria-label="Ambient sound"
        aria-pressed={!isSoundMuted}
        title={isSoundMuted ? "Unmute" : "Mute"}
        className="font-mono text-xs tracking-[0.12em]"
      >
        {icon(
          isSoundMuted
            ? [SPEAKER, "M17 14l4-4m0 4l-4-4"]
            : [
                "M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728",
                SPEAKER,
              ],
        )}
        {isSoundMuted ? "OFF" : "ON"}
      </Button>
      {panelButton(
        "info",
        "Information",
        showInfoPanel,
        "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      )}
      {panelButton("settings", "Settings", showSettingsPanel, [
        "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
        "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      ])}
      {panelButton(
        "social",
        "Social Links",
        showSocialMenu,
        "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
      )}
    </>
  );

  const hint = (text: string) => (
    <div
      className={cn(
        "rounded-card border-rule bg-panel text-muted-foreground pointer-events-none absolute top-full right-0 mt-2 flex items-center gap-2 border px-3 py-1.5 text-xs whitespace-nowrap transition-[opacity,transform] duration-500",
        isSoundMuted && showSoundHint
          ? "translate-y-0 opacity-100"
          : "translate-y-1 opacity-0",
      )}
      aria-hidden="true"
    >
      <span className="size-4">{icon(SPEAKER)}</span>
      {text}
    </div>
  );

  return (
    <>
      {/* ── Mobile: collapsible panel (top-right) ── */}
      <div className="fixed top-6 right-4 z-50 md:hidden">
        <div className="rounded-card border-rule-strong bg-panel relative flex flex-row items-center gap-2 border p-2">
          {/* Buttons expand to the LEFT of the toggle */}
          <div
            inert={!isExpanded}
            className={cn(
              "flex flex-row gap-2 overflow-hidden transition-[max-width,opacity] duration-300",
              isExpanded
                ? "max-w-xs opacity-100"
                : "pointer-events-none max-w-0 opacity-0",
            )}
          >
            {buttons}
          </div>

          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={() => {
              if (isExpanded) {
                if (showInfoPanel) togglePanel("info");
                if (showSettingsPanel) togglePanel("settings");
                if (showSocialMenu) togglePanel("social");
              }
              setIsExpanded((v) => !v);
            }}
            aria-label={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
            aria-expanded={isExpanded}
          >
            {/* Three bars that turn into an X: the outer two meet and cross, the middle one leaves */}
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {[
                { y: 7, shut: "translate-y-[5px] rotate-45" },
                { y: 12, shut: "scale-x-0 opacity-0" },
                { y: 17, shut: "-translate-y-[5px] -rotate-45" },
              ].map(({ y, shut }) => (
                <line
                  key={y}
                  x1="4"
                  y1={y}
                  x2="20"
                  y2={y}
                  className={cn(
                    "origin-center [transform-box:fill-box] motion-safe:transition-[translate,rotate,scale,opacity] motion-safe:duration-(--motion-base)",
                    isExpanded && shut,
                  )}
                />
              ))}
            </svg>
          </Button>
        </div>
        {hint("Ambient sound — tap ☰ to enable")}
      </div>

      {/* ── Desktop: full panel always visible (top-right) ── */}
      <div className="fixed top-8 right-8 z-50 hidden md:block">
        <div className="rounded-card border-rule-strong bg-panel flex flex-row gap-2 border p-2">
          {buttons}
        </div>
        {hint("Ambient sound — click 🔊 to enable")}
      </div>

      {/* Popovers — shared, render as fixed overlays independent of toolbar */}
      <Popover
        isOpen={showInfoPanel}
        ariaLabel="About this site"
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
        ariaLabel="Settings"
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
        ariaLabel="Social links"
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
