/**
 * @fileoverview Encryption utility functions for secure data handling using AES-GCM encryption.
 * This module provides encryption and decryption functionality using the Web Crypto API with
 * PBKDF2 key derivation.
 * 
 * Features:
 * - AES-GCM encryption with 256-bit keys
 * - Secure key derivation using PBKDF2
 * - IV (Initialization Vector) generation
 * - Salt generation for added security
 * - Secure master key storage using expo-secure-store
 * - Base64 encoding for encrypted data
 * 
 * The encryption process:
 * 1. Generates random salt and IV
 * 2. Derives encryption key from master key using PBKDF2
 * 3. Encrypts data using AES-GCM
 * 4. Combines salt, IV, and encrypted data
 * 5. Encodes the result in base64
 * 
 * The decryption process:
 * 1. Decodes base64 data
 * 2. Extracts salt, IV, and encrypted data
 * 3. Derives decryption key using same process
 * 4. Decrypts data using AES-GCM
 * 
 * @requires expo-crypto
 * @requires expo-secure-store
 * 
 * Security considerations:
 * - Uses cryptographically secure random number generation
 * - Implements salt to prevent rainbow table attacks
 * - Uses 100,000 PBKDF2 iterations for key derivation
 * - Stores master key securely using device's secure storage
 * 
 * @copyright Copyright (c) 2025 RYAN SHELBY
 * @license MIT
 */
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

export async function generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(text: string): Promise<string> {
  const iv = await Crypto.getRandomBytesAsync(IV_LENGTH);
  const salt = await Crypto.getRandomBytesAsync(SALT_LENGTH);
  const masterKey = await SecureStore.getItemAsync('master_key');
  
  if (!masterKey) {
    throw new Error('Master key not found');
  }

  const key = await generateKey(masterKey, salt);
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    enc.encode(text)
  );

  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(encryptedArray, salt.length + iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decrypt(encryptedData: string): Promise<string> {
  const combined = new Uint8Array(
    atob(encryptedData)
      .split('')
      .map(char => char.charCodeAt(0))
  );

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const data = combined.slice(SALT_LENGTH + IV_LENGTH);

  const masterKey = await SecureStore.getItemAsync('master_key');
  if (!masterKey) {
    throw new Error('Master key not found');
  }

  const key = await generateKey(masterKey, salt);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    data
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}