import CryptoJS from "crypto-js";

// Encrypt data
export const encryptData = (data: string, key: string) => {
  const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
  return encryptedData;
};

// Hash data for integrity check
export const hashData = (data: string, key: string) => {
  const sha256Hash = CryptoJS.SHA256(`${data}${key}`).toString();
  return sha256Hash;
};
