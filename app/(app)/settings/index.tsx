import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
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
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  const handleWipeData = () => {
    // Implement secure data wiping
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
        <Pressable style={styles.option}>
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
          onPress={() => Linking.openURL('/about')}>
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
        <Pressable style={styles.option} onPress={handleWipeData}>
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
    </View>
  );
}