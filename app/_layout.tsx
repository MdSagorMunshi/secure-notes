/**
 * @fileoverview Root layout component for the mobile application.
 * This component serves as the main layout structure, handling the application's routing
 * and essential provider context setup.
 * 
 * @component
 * @description
 * Root layout component that wraps the entire application with necessary providers and routing setup.
 * Integrates:
 * - Gesture handling support via GestureHandlerRootView
 * - Theme management through ThemeProvider
 * - Authentication state management with AuthProvider
 * - Stack-based navigation with three main routes:
 *   - (auth): Authentication related screens
 *   - (app): Main application screens
 *   - +not-found: Modal screen for 404 errors
 * 
 * @example
 * // This component is automatically used by Expo Router as the root layout
 * // No direct import/usage required
 * 
 * @requires expo-router
 * @requires expo-status-bar
 * @requires react-native-gesture-handler
 * @requires @/hooks/useFrameworkReady
 * @requires @/context/AuthContext
 * @requires @/context/ThemeContext
 * 
 * @copyright RYAN SHELBY (2025)
 * @author Ryan Shelby
 * @version 1.0.0
 */
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}