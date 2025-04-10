import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function ChangePinScreen() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const { verifyPin, changePin } = useAuth();

  const handleChangePin = async () => {
    try {
      setError('');

      if (!currentPin || !newPin || !confirmPin) {
        setError('Please fill in all fields');
        return;
      }

      if (newPin !== confirmPin) {
        setError('New PINs do not match');
        return;
      }

      if (newPin.length !== 6) {
        setError('PIN must be 6 digits');
        return;
      }

      const isValid = await verifyPin(currentPin);
      if (!isValid) {
        setError('Current PIN is incorrect');
        return;
      }

      await changePin(newPin);
      router.back();
    } catch (err) {
      setError('Failed to change PIN');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </Pressable>
        <Text style={styles.title}>Change PIN</Text>
      </View>

      <View style={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current PIN</Text>
          <TextInput
            style={styles.input}
            value={currentPin}
            onChangeText={setCurrentPin}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
            placeholder="Enter current PIN"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New PIN</Text>
          <TextInput
            style={styles.input}
            value={newPin}
            onChangeText={setNewPin}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
            placeholder="Enter new PIN"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New PIN</Text>
          <TextInput
            style={styles.input}
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
            placeholder="Confirm new PIN"
          />
        </View>

        <Pressable style={styles.button} onPress={handleChangePin}>
          <Text style={styles.buttonText}>Change PIN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});