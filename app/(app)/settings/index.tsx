import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Lock,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Info,
  X,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { logout, wipeData } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [wipePin, setWipePin] = useState('');
  const [error, setError] = useState('');

  const handleWipeData = async () => {
    try {
      setError('');
      await wipeData(wipePin);
      setShowWipeModal(false);
      setWipePin('');
    } catch (err) {
      setError('Invalid PIN');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#eee',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#999' : '#666',
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#eee',
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#333' : '#F2F2F7',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    optionDescription: {
      fontSize: 14,
      color: isDark ? '#999' : '#666',
      marginTop: 2,
    },
    footer: {
      padding: 16,
      marginTop: 'auto',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: isDark ? '#1a1a1a' : '#FFF',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#FF3B30',
    },
    logoutText: {
      color: '#FF3B30',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    selectedTheme: {
      color: '#007AFF',
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderRadius: 12,
      padding: 24,
      width: '80%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    closeButton: {
      padding: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#333' : '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      marginBottom: 16,
    },
    error: {
      color: '#FF3B30',
      marginBottom: 16,
      textAlign: 'center',
    },
    wipeButton: {
      backgroundColor: '#FF3B30',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    wipeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Pressable
          style={styles.option}
          onPress={() => setTheme('light')}>
          <View style={styles.optionIcon}>
            <Sun
              size={24}
              color={theme === 'light' ? '#007AFF' : isDark ? '#fff' : '#000'}
            />
          </View>
          <View style={styles.optionContent}>
            <Text
              style={[
                styles.optionTitle,
                theme === 'light' && styles.selectedTheme,
              ]}>
              Light Mode
            </Text>
          </View>
          {theme === 'light' && <ChevronRight size={20} color="#007AFF" />}
        </Pressable>

        <Pressable
          style={styles.option}
          onPress={() => setTheme('dark')}>
          <View style={styles.optionIcon}>
            <Moon
              size={24}
              color={theme === 'dark' ? '#007AFF' : isDark ? '#fff' : '#000'}
            />
          </View>
          <View style={styles.optionContent}>
            <Text
              style={[
                styles.optionTitle,
                theme === 'dark' && styles.selectedTheme,
              ]}>
              Dark Mode
            </Text>
          </View>
          {theme === 'dark' && <ChevronRight size={20} color="#007AFF" />}
        </Pressable>

        <Pressable
          style={styles.option}
          onPress={() => setTheme('system')}>
          <View style={styles.optionIcon}>
            <Monitor
              size={24}
              color={theme === 'system' ? '#007AFF' : isDark ? '#fff' : '#000'}
            />
          </View>
          <View style={styles.optionContent}>
            <Text
              style={[
                styles.optionTitle,
                theme === 'system' && styles.selectedTheme,
              ]}>
              System
            </Text>
            <Text style={styles.optionDescription}>
              Follow system appearance
            </Text>
          </View>
          {theme === 'system' && <ChevronRight size={20} color="#007AFF" />}
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Pressable
          style={styles.option}
          onPress={() => router.push('/settings/change-pin')}>
          <View style={styles.optionIcon}>
            <Lock size={24} color={isDark ? '#fff' : '#007AFF'} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Change PIN</Text>
            <Text style={styles.optionDescription}>Update your security PIN</Text>
          </View>
          <ChevronRight size={20} color={isDark ? '#fff' : '#999'} />
        </Pressable>

        <Pressable style={styles.option}>
          <View style={styles.optionIcon}>
            <Shield size={24} color={isDark ? '#fff' : '#007AFF'} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Security Settings</Text>
            <Text style={styles.optionDescription}>
              Manage app security options
            </Text>
          </View>
          <ChevronRight size={20} color={isDark ? '#fff' : '#999'} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Pressable
          style={styles.option}
          onPress={() => router.push('/about')}>
          <View style={styles.optionIcon}>
            <Info size={24} color={isDark ? '#fff' : '#007AFF'} />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>About App</Text>
            <Text style={styles.optionDescription}>
              View app information and developer details
            </Text>
          </View>
          <ChevronRight size={20} color={isDark ? '#fff' : '#999'} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <Pressable
          style={styles.option}
          onPress={() => setShowWipeModal(true)}>
          <View style={styles.optionIcon}>
            <Trash2 size={24} color="#FF3B30" />
          </View>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: '#FF3B30' }]}>
              Wipe Data
            </Text>
            <Text style={styles.optionDescription}>
              Permanently delete all notes and data
            </Text>
          </View>
          <ChevronRight size={20} color={isDark ? '#fff' : '#999'} />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <LogOut size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>

      <Modal
        visible={showWipeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWipeModal(false)}>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Data Wipe</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setShowWipeModal(false);
                  setWipePin('');
                  setError('');
                }}>
                <X size={24} color={isDark ? '#fff' : '#000'} />
              </Pressable>
            </View>

            <Text style={styles.optionDescription}>
              Enter your PIN to confirm. This action cannot be undone.
            </Text>

            <TextInput
              style={styles.input}
              value={wipePin}
              onChangeText={setWipePin}
              placeholder="Enter PIN"
              placeholderTextColor={isDark ? '#666' : '#999'}
              secureTextEntry
              keyboardType="numeric"
              maxLength={6}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable style={styles.wipeButton} onPress={handleWipeData}>
              <Text style={styles.wipeButtonText}>Wipe All Data</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}