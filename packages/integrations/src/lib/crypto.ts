/**
 * Encryption utilities for sensitive data (OAuth tokens, API keys, etc.)
 *
 * Uses AES-256-GCM for authenticated encryption.
 * All encrypted values are stored in the format: iv:authTag:encryptedData (hex encoded)
 *
 * IMPORTANT: Set INTEGRATION_ENCRYPTION_KEY in your environment:
 * Generate with: openssl rand -hex 32
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { requireEnv } from '../env';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 16 bytes for AES-GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM authentication tag

/**
 * Get the encryption key from environment
 * Must be a 32-byte hex string (64 characters)
 */
function getEncryptionKey(): Buffer {
  const key = requireEnv(
    'INTEGRATION_ENCRYPTION_KEY',
    'INTEGRATION_ENCRYPTION_KEY environment variable is required for encryption. ' +
      'Generate one with: openssl rand -hex 32'
  );

  if (key.length !== 64) {
    throw new Error(
      'INTEGRATION_ENCRYPTION_KEY must be a 32-byte hex string (64 characters). ' +
        'Generate one with: openssl rand -hex 32'
    );
  }

  return Buffer.from(key, 'hex');
}

/**
 * Encrypt a plaintext string
 *
 * @param plaintext - The string to encrypt
 * @returns Encrypted string in format: iv:authTag:encryptedData (hex encoded)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty value');
  }

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return iv:authTag:encrypted (all hex encoded)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt an encrypted string
 *
 * @param encrypted - The encrypted string in format: iv:authTag:encryptedData
 * @returns The decrypted plaintext string
 */
export function decrypt(encrypted: string): string {
  if (!encrypted) {
    throw new Error('Cannot decrypt empty value');
  }

  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error(
      'Invalid encrypted format. Expected iv:authTag:encryptedData'
    );
  }

  const ivHex = parts[0]!;
  const authTagHex = parts[1]!;
  const encryptedData = parts[2]!;

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  if (iv.length !== IV_LENGTH) {
    throw new Error('Invalid IV length');
  }

  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error('Invalid auth tag length');
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Check if a value is encrypted (has the expected format)
 *
 * @param value - The value to check
 * @returns true if the value appears to be encrypted
 */
export function isEncrypted(value: string): boolean {
  if (!value) return false;

  const parts = value.split(':');
  if (parts.length !== 3) return false;

  const ivHex = parts[0]!;
  const authTagHex = parts[1]!;

  // Check if IV and auth tag are valid hex strings of correct length
  return (
    ivHex.length === IV_LENGTH * 2 &&
    authTagHex.length === AUTH_TAG_LENGTH * 2 &&
    /^[0-9a-f]+$/i.test(ivHex) &&
    /^[0-9a-f]+$/i.test(authTagHex)
  );
}

/**
 * Safely encrypt a value (returns null if value is null/undefined)
 */
export function encryptIfPresent(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return encrypt(value);
}

/**
 * Safely decrypt a value (returns null if value is null/undefined)
 */
export function decryptIfPresent(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return decrypt(value);
}

/**
 * Re-encrypt a value with a new key (for key rotation)
 *
 * @param encrypted - The currently encrypted value
 * @param oldKey - The old encryption key (hex string)
 * @returns The value encrypted with the current key
 */
export function reEncrypt(encrypted: string, oldKey: string): string {
  if (!encrypted || !oldKey) {
    throw new Error('Both encrypted value and old key are required');
  }

  // Decrypt with old key
  const parts = encrypted.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted format');
  }

  const ivHex = parts[0]!;
  const authTagHex = parts[1]!;
  const encryptedData = parts[2]!;
  
  const oldKeyBuffer = Buffer.from(oldKey, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = createDecipheriv(ALGORITHM, oldKeyBuffer, iv);
  decipher.setAuthTag(authTag);

  let plaintext = decipher.update(encryptedData, 'hex', 'utf8');
  plaintext += decipher.final('utf8');

  // Encrypt with new key
  return encrypt(plaintext);
}
