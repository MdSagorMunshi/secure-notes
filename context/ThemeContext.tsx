/**
 * @fileoverview Theme context provider and hook for managing application-wide theme settings.
 * This module provides functionality to handle light, dark, and system theme preferences
 * with persistent storage capabilities.
 * 
 * @module ThemeContext
 * @requires react
 * @requires react-native
 * 
 * @typedef {'light' | 'dark' | 'system'} Theme - Available theme options
 * 
 * @interface ThemeContextType
 * @property {Theme} theme - Current theme selection
 * @property {function} setTheme - Function to update theme
 * @property {boolean} isDark - Boolean indicating if dark mode is active
 * 
 * @component ThemeProvider
 * @description Provider component that manages theme state and preferences
 * Features:
 * - System theme detection
 * - Persistent theme storage
 * - Automatic theme loading
 * - Theme switching capabilities
 * 
 * @hook useTheme
 * @description Custom hook to access theme context within components
 * @throws {Error} When used outside of ThemeProvider
 * @returns {ThemeContextType} Theme context value
 * 
 * @example
 * // Wrap your app with ThemeProvider
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * @example
 * // Use theme in components
 * const { theme, setTheme, isDark } = useTheme();
 * 
 * @copyright RYAN SHELBY (2025)
 * @author RYAN SHELBY
 * @version 1.0.0
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');

  const isDark =
    theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await localStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as Theme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}