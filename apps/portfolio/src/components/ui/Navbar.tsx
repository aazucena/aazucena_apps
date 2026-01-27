import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X
} from '@mynaui/icons-react';
import { ThemeToggle } from './ThemeToggle';
import { toTitleCase } from '~/lib/utils/text';
import { getNavigationIcon } from '~/lib/utils/icons';
import type { NavigationItem } from '~/lib/validators/navigation';

interface NavbarProps {
  siteName: string;
  currentPath: string;
  logoUrl?: string;
  navItems: NavigationItem[];
}

export function Navbar({ siteName, currentPath, logoUrl, navItems }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Map navigation items with icon components
  const navItemsWithIcons = navItems.map(item => ({
    ...item,
    iconComponent: getNavigationIcon(item.icon),
  }));

  // Separate navigation items by type: regular links vs CTA buttons
  const regularNavItems = navItemsWithIcons.filter(item => !item.buttonStyle);
  const ctaButtons = navItemsWithIcons.filter(item => item.buttonStyle);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path change (client-side navigation)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
        isScrolled 
          ? 'py-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-gray-200/50 dark:border-gray-800/50 shadow-sm' 
          : 'py-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="/" className="group flex items-center gap-3 relative z-[110]">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={siteName} 
                className="h-16 w-auto transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter transition-transform duration-500 group-hover:scale-105">
                {toTitleCase(siteName)}<span className="text-blue-600">.</span>
              </span>
            )}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-gray-50/50 dark:bg-gray-900/50 p-1.5 rounded-full border border-gray-100 dark:border-gray-800 backdrop-blur-md">
            {regularNavItems.map((item) => {
              const isActive = currentPath.startsWith(item.path || '');
              const Icon = item.iconComponent;

              return (
                <a
                  key={item.id}
                  href={item.path || undefined}
                  className={`
                    relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300
                    ${isActive
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}
                  `}
                  target={item.type === 'EXTERNAL' ? '_blank' : undefined}
                  rel={item.type === 'EXTERNAL' ? 'noopener noreferrer' : undefined}
                >
                  {Icon && <Icon size={14} className={isActive ? 'text-blue-600' : 'text-current'} />}
                  {toTitleCase(item.title)}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 border-2 border-blue-600/10 dark:border-blue-400/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA / Mobile Toggle */}
          <div className="flex items-center gap-4 relative z-[110]">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Dynamic CTA Buttons from navigation */}
            {ctaButtons.map((button) => {
              const Icon = button.iconComponent;
              const buttonClasses = {
                primary: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-50',
                secondary: 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600',
                outline: 'bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900',
              };

              return (
                <a
                  key={button.id}
                  href={button.path || undefined}
                  className={`hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 group ${buttonClasses[button.buttonStyle || 'primary']}`}
                  target={button.type === 'EXTERNAL' ? '_blank' : undefined}
                  rel={button.type === 'EXTERNAL' ? 'noopener noreferrer' : undefined}
                >
                  {Icon && <Icon size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                  {toTitleCase(button.title)}
                </a>
              );
            })}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
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
              className="fixed inset-0 bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[300px] bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 z-[105] md:hidden p-8 pt-24 flex flex-col gap-8 shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400">Navigation</span>
                  <ThemeToggle />
                </div>
                {regularNavItems.map((item) => {
                  const isActive = currentPath.startsWith(item.path || '');
                  const Icon = item.iconComponent;

                  return (
                    <a
                      key={item.id}
                      href={item.path || undefined}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl text-base font-bold transition-all
                        ${isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}
                      `}
                      target={item.type === 'EXTERNAL' ? '_blank' : undefined}
                      rel={item.type === 'EXTERNAL' ? 'noopener noreferrer' : undefined}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white dark:bg-gray-950 shadow-sm' : 'bg-gray-100 dark:bg-gray-800'}`}>
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
                    primary: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
                    secondary: 'bg-blue-600 dark:bg-blue-500 text-white',
                    outline: 'bg-transparent border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white',
                  };

                  return (
                    <a
                      key={button.id}
                      href={button.path || undefined}
                      className={`flex items-center justify-center gap-3 w-full py-5 rounded-[1.5rem] font-bold text-sm ${mobileButtonClasses[button.buttonStyle || 'primary']}`}
                      target={button.type === 'EXTERNAL' ? '_blank' : undefined}
                      rel={button.type === 'EXTERNAL' ? 'noopener noreferrer' : undefined}
                    >
                      {Icon && <Icon size={16} />}
                      {toTitleCase(button.title)}
                    </a>
                  );
                })}
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 font-medium">
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
