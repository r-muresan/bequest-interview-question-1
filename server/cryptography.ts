import 'dotenv/config'
import CryptoJS from 'crypto-js';

const PRIVATE_KEY = process.env.PRIVATE_KEY

export function signData (data: string) {
  const signature = CryptoJS.HmacSHA256(data, PRIVATE_KEY!).toString(CryptoJS.enc.Hex);
  return signature;
};

export function verifySignature (data: string, signature: string) {
  const computedSignature = CryptoJS.HmacSHA256(data, PRIVATE_KEY!).toString(CryptoJS.enc.Hex);
  return computedSignature === signature;
};
