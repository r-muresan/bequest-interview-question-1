import crypto from 'crypto';

export function generateHash(data: string, secretKey: string): string {
  return crypto.createHash("sha256").update(`${data}${secretKey}`).digest("hex");
}
