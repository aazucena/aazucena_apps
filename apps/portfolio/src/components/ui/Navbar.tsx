import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@aazucena/icons";
import { ThemeToggle } from "./ThemeToggle";
import { toTitleCase } from "@aazucena/utils";
import { getNavigationIcon } from "~/lib/utils/icons";
import type { NavigationItem } from "~/lib/validators/navigation";

interface NavbarProps {
  siteName: string;
  currentPath: string;
  logoUrl?: string;
  navItems: NavigationItem[];
}

export function Navbar({
  siteName,
  currentPath,
  logoUrl,
  navItems,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Map navigation items with icon components
  const navItemsWithIcons = navItems.map((item) => ({
    ...item,
    iconComponent: getNavigationIcon(item.icon),
  }));

  // Separate navigation items by type: regular links vs CTA buttons
  const regularNavItems = navItemsWithIcons.filter((item) => !item.buttonStyle);
  const ctaButtons = navItemsWithIcons.filter((item) => item.buttonStyle);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path change (client-side navigation)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-[100] border-b transition-all duration-500 ${
        isScrolled
          ? "border-gray-200/50 bg-white/90 py-4 shadow-sm backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/90"
          : "border-transparent bg-white/80 py-6 backdrop-blur-lg dark:bg-gray-950/80"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="group relative z-[110] flex items-center gap-3"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-16 w-auto transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="text-xl font-black tracking-tighter text-gray-900 transition-transform duration-500 group-hover:scale-105 dark:text-white">
                {toTitleCase(siteName)}
                <span className="text-blue-600">.</span>
              </span>
            )}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 rounded-full border border-gray-100 bg-gray-50/50 p-1.5 backdrop-blur-md md:flex dark:border-gray-800 dark:bg-gray-900/50">
            {regularNavItems.map((item) => {
              const isActive = currentPath.startsWith(item.path || "");
              const Icon = item.iconComponent;

              return (
                <a
                  key={item.id}
                  href={item.path || undefined}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  } `}
                  target={item.type === "EXTERNAL" ? "_blank" : undefined}
                  rel={
                    item.type === "EXTERNAL" ? "noopener noreferrer" : undefined
                  }
                >
                  {Icon && (
                    <Icon
                      size={14}
                      className={isActive ? "text-blue-600" : "text-current"}
                    />
                  )}
                  {toTitleCase(item.title)}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-full border-2 border-blue-600/10 dark:border-blue-400/10"
                      transition={{
                        type: "spring",
                        bounce: 0.3,
                        duration: 0.6,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA / Mobile Toggle */}
          <div className="relative z-[110] flex items-center gap-4">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Dynamic CTA Buttons from navigation */}
            {ctaButtons.map((button) => {
              const Icon = button.iconComponent;
              const buttonClasses = {
                primary:
                  "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-50",
                secondary:
                  "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600",
                outline:
                  "bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900",
              };

              return (
                <a
                  key={button.id}
                  href={button.path || undefined}
                  className={`group hidden items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold shadow-lg transition-all active:scale-95 sm:flex ${buttonClasses[button.buttonStyle || "primary"]}`}
                  target={button.type === "EXTERNAL" ? "_blank" : undefined}
                  rel={
                    button.type === "EXTERNAL"
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {Icon && (
                    <Icon
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  )}
                  {toTitleCase(button.title)}
                </a>
              );
            })}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-gray-600 transition-colors hover:text-blue-600 md:hidden dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm md:hidden dark:bg-gray-950/60"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[105] flex w-full max-w-[300px] flex-col gap-8 border-l border-gray-100 bg-white p-8 pt-24 shadow-2xl md:hidden dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-col gap-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    Navigation
                  </span>
                  <ThemeToggle />
                </div>
                {regularNavItems.map((item) => {
                  const isActive = currentPath.startsWith(item.path || "");
                  const Icon = item.iconComponent;

                  return (
                    <a
                      key={item.id}
                      href={item.path || undefined}
                      className={`flex items-center gap-4 rounded-2xl p-4 text-base font-bold transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                      } `}
                      target={item.type === "EXTERNAL" ? "_blank" : undefined}
                      rel={
                        item.type === "EXTERNAL"
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-white shadow-sm dark:bg-gray-950" : "bg-gray-100 dark:bg-gray-800"}`}
                      >
                        {Icon && <Icon size={18} />}
                      </div>
                      {toTitleCase(item.title)}
                    </a>
                  );
                })}
              </div>

              <div className="mt-auto space-y-6">
                {/* Dynamic CTA Buttons in mobile menu */}
                {ctaButtons.map((button) => {
                  const Icon = button.iconComponent;
                  const mobileButtonClasses = {
                    primary:
                      "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                    secondary: "bg-blue-600 dark:bg-blue-500 text-white",
                    outline:
                      "bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white",
                  };

                  return (
                    <a
                      key={button.id}
                      href={button.path || undefined}
                      className={`flex w-full items-center justify-center gap-3 rounded-[1.5rem] py-5 text-sm font-bold ${mobileButtonClasses[button.buttonStyle || "primary"]}`}
                      target={button.type === "EXTERNAL" ? "_blank" : undefined}
                      rel={
                        button.type === "EXTERNAL"
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {Icon && <Icon size={16} />}
                      {toTitleCase(button.title)}
                    </a>
                  );
                })}
                <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                  © {new Date().getFullYear()} {toTitleCase(siteName)}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
