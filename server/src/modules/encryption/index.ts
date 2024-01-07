import crypto from 'crypto'

export function calculateHash(data: string) {
  const hash = crypto.createHash('sha256')
  hash.update(data)
  return hash.digest('hex')
}

export function verifyHash(data: string, storedHash: string) {
  const calculatedHash = calculateHash(data)
  return calculatedHash === storedHash
}
