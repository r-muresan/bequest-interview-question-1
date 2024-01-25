import CryptoJS from 'crypto-js';

const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY!.replace(/\\n/g, '\n')

export function signData (data: string) {
  const signature = CryptoJS.HmacSHA256(data, PRIVATE_KEY!).toString(CryptoJS.enc.Hex);
  return signature;
};

export function verifySignature (data: string, signature: string) {
  const computedSignature = CryptoJS.HmacSHA256(data, PRIVATE_KEY!).toString(CryptoJS.enc.Hex);
  return computedSignature === signature;
};
