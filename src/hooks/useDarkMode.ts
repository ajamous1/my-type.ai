'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export function useDarkMode(): boolean {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateDarkMode = () => {
      if (theme === 'dark') {
        setIsDark(true);
      } else if (theme === 'light') {
        setIsDark(false);
      } else if (theme === 'system') {
        // For system theme, check the actual media query
        if (typeof window !== 'undefined') {
          setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
      }
    };

    updateDarkMode();

    // Listen for system theme changes when in system mode
    if (theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateDarkMode();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return isDark;
}
