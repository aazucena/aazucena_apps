import { useState, useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { ArrowRight, Menu, X } from "@aazucena/icons";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  ThemeToggle,
} from "@aazucena/ui";
import { toTitleCase } from "@aazucena/utils";
import { getNavigationIcon } from "~/lib/utils/icons";
import type { NavigationItem } from "@aazucena/types";

interface NavbarProps {
  siteName: string;
  currentPath: string;
  logoUrl?: string;
  navItems: NavigationItem[];
}

const ctaVariant = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
} as const;

export function Navbar({
  siteName,
  currentPath,
  logoUrl,
  navItems,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Swipe right on the open menu closes it; the panel follows the finger while it moves
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);
  const swiped = useRef(false);
  const [swipeX, setSwipeX] = useState(0);
  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onSwipeStart = (event: PointerEvent) => {
    swiped.current = false;
    swipe.current = { x: event.clientX, y: event.clientY, t: event.timeStamp };
  };
  const onSwipeMove = (event: PointerEvent) => {
    const start = swipe.current;
    if (!start || reducedMotion()) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    setSwipeX(dx > 0 && dx > Math.abs(dy) ? dx : 0);
  };
  const onSwipeEnd = (event: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    setSwipeX(0);
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    swiped.current = Math.abs(dx) > 10;
    const speed = dx / Math.max(event.timeStamp - start.t, 1);
    if (dx > Math.abs(dy) && (dx > 80 || (dx > 30 && speed > 0.5))) {
      setIsMobileMenuOpen(false);
    }
  };

  // Map navigation items with icon components
  const navItemsWithIcons = navItems.map((item) => ({
    ...item,
    iconComponent: getNavigationIcon(item.icon),
  }));

  // Separate navigation items by type: regular links vs CTA buttons
  const regularNavItems = navItemsWithIcons.filter((item) => !item.buttonStyle);
  const ctaButtons = navItemsWithIcons.filter((item) => item.buttonStyle);

  // Close mobile menu on path change (client-side navigation)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  // The sheet is hidden from lg up; close it so its scrim and scroll lock don't outlive it
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const close = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMobileMenuOpen(false);
    };
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);

  const externalProps = (type?: string) =>
    type === "EXTERNAL"
      ? { target: "_blank", rel: "noopener noreferrer" }
      : undefined;

  const logo = (
    <a
      href="/"
      className="group focus-visible:outline-signal flex items-center gap-3 focus-visible:outline-1 focus-visible:outline-offset-4"
      aria-label={siteName}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={siteName}
          className="hover-grow h-10 w-auto [--grow:1.05]"
        />
      ) : (
        <span className="text-foreground hover-grow text-xl font-semibold tracking-tight [--grow:1.05]">
          {toTitleCase(siteName)}
          <span className="text-signal">.</span>
        </span>
      )}
    </a>
  );

  return (
    <nav
      aria-label="Main"
      data-testid="navbar"
      className="bg-background border-rule fixed top-0 right-0 left-0 z-[100] border-b"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {logo}

        {/* Desktop Navigation */}
        <div className="hidden items-stretch gap-1 self-stretch lg:flex">
          {regularNavItems.map((item) => {
            const isActive = currentPath.startsWith(item.path || "");
            const Icon = item.iconComponent;

            return (
              <a
                key={item.id}
                href={item.path || undefined}
                aria-current={isActive ? "page" : undefined}
                className={`micro-label focus-visible:outline-signal flex items-center gap-2 border-b-2 px-4 transition-[color,border-color] duration-(--motion-base) focus-visible:outline-1 focus-visible:-outline-offset-2 ${
                  isActive
                    ? "border-signal text-foreground"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                }`}
                {...externalProps(item.type)}
              >
                {Icon && (
                  <Icon
                    size={14}
                    className={isActive ? "text-signal" : "text-current"}
                  />
                )}
                {toTitleCase(item.title)}
              </a>
            );
          })}
        </div>

        {/* CTA / Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggle size="sm" />
          </div>

          {/* Dynamic CTA Buttons from navigation */}
          {ctaButtons.map((button) => {
            const Icon = button.iconComponent;
            return (
              <Button
                key={button.id}
                asChild
                variant={ctaVariant[button.buttonStyle || "primary"]}
                className="press hidden sm:inline-flex"
              >
                <a
                  href={button.path || undefined}
                  className="group"
                  {...externalProps(button.type)}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      aria-hidden="true"
                      className="hover-nudge [--nudge-y:-2px]"
                    />
                  )}
                  {toTitleCase(button.title)}
                </a>
              </Button>
            );
          })}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-signal text-signal lg:hidden"
                aria-label="Open menu"
                data-testid="navbar-mobile-toggle"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              data-testid="navbar-mobile-menu"
              aria-describedby={undefined}
              className="flex w-full max-w-none touch-pan-y flex-col gap-0 p-0 sm:max-w-none lg:hidden [&>button.absolute]:hidden"
              style={
                swipeX
                  ? ({
                      translate: `${swipeX}px 0`,
                      transition: "none",
                    } as CSSProperties)
                  : undefined
              }
              onDragStart={(event) => event.preventDefault()}
              onClickCapture={(event) => {
                if (swiped.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  swiped.current = false;
                }
              }}
              onPointerDown={onSwipeStart}
              onPointerMove={onSwipeMove}
              onPointerUp={onSwipeEnd}
              onPointerCancel={() => {
                swipe.current = null;
                setSwipeX(0);
              }}
            >
              <div className="border-rule flex h-14 items-center justify-between border-b px-4">
                {logo}
                <SheetTitle className="sr-only">
                  {toTitleCase(siteName)}
                </SheetTitle>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-control border-signal text-signal h-9 w-9"
                    aria-label="Close menu"
                    data-testid="navbar-mobile-close"
                  >
                    <X size={18} aria-hidden="true" />
                  </Button>
                </SheetClose>
              </div>
              <div className="flex flex-col overflow-y-auto">
                {regularNavItems.map((item) => {
                  const isActive = currentPath.startsWith(item.path || "");
                  const Icon = item.iconComponent;
                  return (
                    <a
                      key={item.id}
                      href={item.path || undefined}
                      aria-current={isActive ? "page" : undefined}
                      className={`border-rule focus-visible:outline-signal flex items-center gap-3 border-b px-5 py-4 font-mono text-sm tracking-[0.12em] uppercase focus-visible:outline-1 focus-visible:-outline-offset-2 ${
                        isActive
                          ? "bg-state text-signal border-l-signal border-l-2"
                          : "text-foreground hover:bg-state"
                      }`}
                      {...externalProps(item.type)}
                    >
                      {Icon && (
                        <Icon
                          size={16}
                          aria-hidden="true"
                          className={
                            isActive ? "text-signal" : "text-muted-foreground"
                          }
                        />
                      )}
                      <span className="flex-1">{toTitleCase(item.title)}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
              <div className="flex flex-col gap-4 p-5">
                {ctaButtons.map((button) => {
                  const Icon = button.iconComponent;
                  return (
                    <Button
                      key={button.id}
                      asChild
                      variant={ctaVariant[button.buttonStyle || "primary"]}
                      size="lg"
                      className="press w-full"
                    >
                      <a
                        href={button.path || undefined}
                        {...externalProps(button.type)}
                      >
                        {Icon && <Icon size={16} aria-hidden="true" />}
                        {toTitleCase(button.title)}
                      </a>
                    </Button>
                  );
                })}
                <div className="flex items-center justify-between">
                  <span className="micro-label text-muted-foreground">
                    Theme
                  </span>
                  <ThemeToggle size="sm" />
                </div>
                <p className="micro-label text-muted-foreground">
                  © {new Date().getFullYear()} {toTitleCase(siteName)}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
