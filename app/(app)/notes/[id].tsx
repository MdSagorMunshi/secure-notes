import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Save, ArrowLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { createNote, getNotes } from '@/utils/database';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id !== 'new') {
      loadNote();
    }
  }, [id]);

  async function loadNote() {
    try {
      const notes = await getNotes();
      const note = notes.find(n => n.id === id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    } catch (error) {
      console.error('Failed to load note:', error);
    }
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      await createNote({
        id: id === 'new' ? Date.now().toString() : id as string,
        title,
        content,
        categoryId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      router.back();
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#007AFF" />
        </Pressable>
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Save size={24} color="#007AFF" />
        </Pressable>
      </View>
      <ScrollView style={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="Note Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 0,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    minHeight: 200,
    padding: 0,
  },
});