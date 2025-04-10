import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { Lock, Delete } from 'lucide-react-native';

const PIN_LENGTH = 6;
const MAX_ATTEMPTS = 3;
const SCREEN_WIDTH = Dimensions.get('window').width;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handlePinInput = async (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + digit;
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        try {
          await login(newPin);
          router.replace('/(app)');
        } catch (err) {
          setAttempts(prev => prev + 1);
          setError('Invalid PIN');
          setPin('');

          if (attempts + 1 >= MAX_ATTEMPTS) {
            setError('Too many attempts. Data wiped.');
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const renderKey = useCallback(
    (num: number | string) => {
      const isDelete = num === 'delete';
      const isEmpty = num === '';

      if (isEmpty) return <View style={styles.key} />;

      return (
        <AnimatedPressable
          entering={FadeInDown.delay(isDelete ? 300 : num * 100).springify()}
          style={[styles.key, isDelete && styles.deleteKey]}
          onPress={() => (isDelete ? handleDelete() : handlePinInput(num.toString()))}>
          {isDelete ? (
            <Delete size={24} color="#FF3B30" />
          ) : (
            <Text style={styles.keyText}>{num}</Text>
          )}
          <Animated.View style={styles.keyBackground} />
        </AnimatedPressable>
      );
    },
    [pin]
  );

  return (
    <Animated.View 
      entering={FadeIn.duration(500)}
      style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.header}>
          <Lock size={48} color="#007AFF" />
          <Text style={styles.title}>Enter PIN</Text>
          {error ? (
            <Animated.Text 
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.error}>
              {error}
            </Animated.Text>
          ) : null}
        </Animated.View>

        <View style={styles.dotsContainer}>
          {Array(PIN_LENGTH)
            .fill(0)
            .map((_, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(i * 100).springify()}
                style={[
                  styles.dot,
                  i < pin.length && styles.dotFilled,
                  error && styles.dotError,
                ]}
              />
            ))}
        </View>

        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'delete'].map((num, index) => (
            <View key={index} style={styles.keyWrapper}>
              {renderKey(num)}
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  error: {
    color: '#FF3B30',
    marginTop: 8,
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
    margin: 8,
    transform: [{ scale: 0.8 }],
  },
  dotFilled: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1 }],
  },
  dotError: {
    backgroundColor: '#FF3B30',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: Math.min(400, SCREEN_WIDTH - 40),
  },
  keyWrapper: {
    width: '33.33%',
    aspectRatio: 1.5,
    padding: 8,
  },
  key: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  deleteKey: {
    backgroundColor: 'transparent',
  },
  keyText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#000',
  },
  keyBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.05)',
    opacity: 0,
  },
});