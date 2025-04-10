/**
 * @fileoverview Database utilities for secure note-taking application
 * This module provides SQLite database operations for managing encrypted notes and categories
 * @author Ryan Shelby
 * @copyright Copyright (c) 2025 Ryan Shelby. All rights reserved.
 * 
 * @module database
 * 
 * The database schema consists of three main tables:
 * - categories: Stores note categories with encrypted metadata
 * - notes: Stores encrypted note data with category relationships
 * - versions: Stores version history of notes
 * 
 * @typedef {Object} Note
 * @property {string} id - Unique identifier for the note
 * @property {string} title - Title of the note
 * @property {string} content - Content of the note
 * @property {string} categoryId - Reference to the category
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * 
 * @typedef {Object} Category
 * @property {string} id - Unique identifier for the category
 * @property {string} name - Name of the category
 * @property {string} color - Color code for the category
 * 
 * @exports initDatabase - Initializes the database schema
 * @exports createNote - Creates a new encrypted note
 * @exports getNotes - Retrieves and decrypts notes, optionally filtered by category
 */
import * as SQLite from 'expo-sqlite';
import { encrypt, decrypt } from './encryption';

const db = SQLite.openDatabase('secure_notes.db');

interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export async function initDatabase() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          encrypted_data TEXT NOT NULL
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          category_id TEXT,
          encrypted_data TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (category_id) REFERENCES categories (id)
        );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS versions (
          id TEXT PRIMARY KEY,
          note_id TEXT NOT NULL,
          encrypted_data TEXT NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY (note_id) REFERENCES notes (id)
        );`
      );
    }, reject, resolve);
  });
}

export async function createNote(note: Note): Promise<void> {
  const encryptedData = await encrypt(JSON.stringify({
    title: note.title,
    content: note.content
  }));

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO notes (id, category_id, encrypted_data, created_at, updated_at)
         VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
        [note.id, note.categoryId, encryptedData],
        (_, result) => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function getNotes(categoryId?: string): Promise<Note[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      const query = categoryId
        ? `SELECT * FROM notes WHERE category_id = ? ORDER BY updated_at DESC`
        : `SELECT * FROM notes ORDER BY updated_at DESC`;
      const params = categoryId ? [categoryId] : [];

      tx.executeSql(
        query,
        params,
        async (_, { rows: { _array } }) => {
          const decryptedNotes = await Promise.all(
            _array.map(async (note: any) => {
              const decrypted = await decrypt(note.encrypted_data);
              const { title, content } = JSON.parse(decrypted);
              return {
                id: note.id,
                title,
                content,
                categoryId: note.category_id,
                createdAt: note.created_at,
                updatedAt: note.updated_at
              };
            })
          );
          resolve(decryptedNotes);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}