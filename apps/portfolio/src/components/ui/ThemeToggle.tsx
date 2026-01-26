import React, { useEffect, useState } from 'react';
import { Sun, Moon } from '@mynaui/icons-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Initialize state based on document class
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer group shadow-sm hover:shadow-md"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <div className={`absolute inset-0 transition-all duration-500 transform ${theme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0 scale-0'}`}>
          <Sun size={20} />
        </div>
        <div className={`absolute inset-0 transition-all duration-500 transform ${theme === 'light' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0 scale-0'}`}>
          <Moon size={20} />
        </div>
      </div>
    </button>
  );
}
