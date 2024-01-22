import SHA256 from "crypto-js/sha256";

export const validateChecksum = (data: string, checksum: string) => {
  const hash = SHA256(data).toString();
  return hash === checksum;
};
