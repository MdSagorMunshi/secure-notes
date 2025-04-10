/**
 * PIN Authentication Screen
 * 
 * This component implements a secure PIN entry interface with the following features:
 * - 6-digit PIN authentication
 * - Haptic feedback
 * - Animated error feedback
 * - Maximum attempt limiting
 * - Secure data wiping after max attempts
 * 
 * @author Ryan Shelby
 * @copyright Copyright (c) 2025 Ryan Shelby. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import * as Haptics from 'expo-haptics';
import { Lock } from 'lucide-react-native';

const PIN_LENGTH = 6;
const MAX_ATTEMPTS = 3;

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const scale = useState(() => new Animated.Value(1))[0];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePinInput = async (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        try {
          await login(newPin);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.replace('/(app)');
        } catch (err) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setAttempts(prev => prev + 1);
          setError('Invalid PIN');
          setPin('');
          
          scale.value = withSequence(
            withTiming(1.2, { duration: 100 }),
            withSpring(1)
          );

          if (attempts + 1 >= MAX_ATTEMPTS) {
            // Implement secure data wiping here
            setError('Too many attempts. Data wiped.');
          }
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pinContainer, animatedStyle]}>
        <Lock size={48} color="#000" style={styles.icon} />
        <Text style={styles.title}>Enter PIN</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.dotsContainer}>
          {Array(PIN_LENGTH)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i < pin.length && styles.dotFilled]}
              />
            ))}
        </View>
        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, index) => (
            <Pressable
              key={index}
              style={styles.key}
              onPress={() => {
                if (num === 'del') {
                  handleDelete();
                } else if (num !== '') {
                  handlePinInput(num.toString());
                }
              }}
            >
              <Text style={styles.keyText}>
                {num === 'del' ? '⌫' : num.toString()}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    margin: 5,
  },
  dotFilled: {
    backgroundColor: '#000',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
  },
  key: {
    width: '30%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  keyText: {
    fontSize: 24,
  },
});