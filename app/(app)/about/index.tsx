import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import {
  Github,
  Linkedin,
  MessageCircle,
  Send,
  ArrowLeft,
} from 'lucide-react-native';
import { router } from 'expo-router';

const DEVELOPER = {
  name: 'RYAN SHELBY',
  github: 'MdSagorMunshi',
  linkedin: 'rynex',
  reddit: 'leesiwoo_s',
  telegram: 'leesiwoo_s',
};

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    icon: Github,
    url: `https://github.com/${DEVELOPER.github}`,
    color: '#333',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: `https://linkedin.com/in/${DEVELOPER.linkedin}`,
    color: '#0077B5',
  },
  {
    name: 'Reddit',
    icon: MessageCircle,
    url: `https://reddit.com/user/${DEVELOPER.reddit}`,
    color: '#FF4500',
  },
  {
    name: 'Telegram',
    icon: Send,
    url: `https://t.me/${DEVELOPER.telegram}`,
    color: '#0088cc',
  },
];

export default function AboutScreen() {
  const { isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
    },
    header: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#eee',
    },
    backButton: {
      marginRight: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    content: {
      padding: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDark ? '#fff' : '#000',
    },
    text: {
      fontSize: 16,
      lineHeight: 24,
      color: isDark ? '#ccc' : '#666',
      marginBottom: 8,
    },
    developerSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 16,
    },
    developerName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
    },
    socialLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    socialButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
    },
    version: {
      textAlign: 'center',
      color: isDark ? '#666' : '#999',
      marginTop: 32,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color={isDark ? '#fff' : '#000'} />
        </Pressable>
        <Text style={styles.title}>About</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.developerSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop' }}
            style={styles.avatar}
          />
          <Text style={styles.developerName}>{DEVELOPER.name}</Text>
          <Text style={styles.text}>Full Stack Developer</Text>

          <View style={styles.socialLinks}>
            {SOCIAL_LINKS.map((link, index) => (
              <Pressable
                key={index}
                style={styles.socialButton}
                onPress={() => Linking.openURL(link.url)}>
                <link.icon
                  size={24}
                  color={isDark ? '#fff' : link.color}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the App</Text>
          <Text style={styles.text}>
            This is a highly secure note-taking application built with React Native
            and Expo. It features military-grade encryption, offline-first
            architecture, and a modern user interface.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Features</Text>
          <Text style={styles.text}>• AES-256-GCM encryption</Text>
          <Text style={styles.text}>• Secure PIN-based authentication</Text>
          <Text style={styles.text}>• Automatic data wiping</Text>
          <Text style={styles.text}>• Offline-first architecture</Text>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
}