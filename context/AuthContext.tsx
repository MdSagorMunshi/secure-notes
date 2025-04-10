/**
 * Authentication Context Provider for managing PIN-based authentication state.
 * @file AuthContext.tsx
 * @copyright RYAN SHELBY (2025)
 * 
 * @description
 * This file implements a React Context-based authentication system with the following features:
 * - PIN-based authentication with secure hashing
 * - Automatic logout on app background
 * - Inactivity timeout (3 minutes)
 * - Secure storage of PIN hash and salt using expo-secure-store
 * - First-time PIN setup handling
 * 
 * @component AuthProvider
 * Provides authentication context to child components with methods for:
 * - login: Authenticates user with PIN
 * - logout: Ends authenticated session
 * - checkInactivity: Monitors user activity timeout
 * 
 * @interface AuthContextType
 * @property {boolean} isAuthenticated - Current authentication state
 * @property {function} login - Async function to authenticate with PIN
 * @property {function} logout - Async function to end session
 * @property {function} checkInactivity - Function to check and handle user inactivity
 * 
 * @hook useAuth
 * Custom hook to access authentication context within components
 * 
 * @security
 * - Uses SHA-512 hashing with salt for PIN storage
 * - Implements secure storage with expo-secure-store
 * - Automatic session termination for security
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <YourApp />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { AppState } from 'react-native';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (pin: string) => Promise<void>;
  logout: () => Promise<void>;
  checkInactivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INACTIVITY_TIMEOUT = 180000; // 3 minutes in milliseconds
let lastActivity = Date.now();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        logout();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const hashPin = async (pin: string): Promise<string> => {
    const salt = await SecureStore.getItemAsync('pin_salt');
    const pinWithSalt = `${pin}${salt}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      pinWithSalt
    );
    return hash;
  };

  const login = async (pin: string) => {
    try {
      const storedHash = await SecureStore.getItemAsync('pin_hash');
      const hash = await hashPin(pin);

      if (!storedHash) {
        // First time setup
        const salt = await Crypto.getRandomBytesAsync(16);
        await SecureStore.setItemAsync('pin_salt', salt.toString());
        await SecureStore.setItemAsync('pin_hash', hash);
        setIsAuthenticated(true);
        lastActivity = Date.now();
        return;
      }

      if (hash === storedHash) {
        setIsAuthenticated(true);
        lastActivity = Date.now();
      } else {
        throw new Error('Invalid PIN');
      }
    } catch (error) {
      throw new Error('Invalid PIN');
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    router.replace('/(auth)/pin');
  };

  const checkInactivity = () => {
    const now = Date.now();
    if (now - lastActivity > INACTIVITY_TIMEOUT) {
      logout();
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    checkInactivity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}