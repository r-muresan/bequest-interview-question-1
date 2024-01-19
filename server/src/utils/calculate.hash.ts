import crypto from 'crypto';
import getEnvVar from '../getEnvVar';

export function calculateHash(
  index: number, 
  timestamp: string, 
  data: string, 
  previousHash: string
): string {
  const phrase = index + timestamp + data + previousHash;
  const salt = getEnvVar('SALT');
  const hash = crypto.pbkdf2Sync(phrase, salt, 1000, 64, `sha512`).toString(`hex`);
  return hash;
}