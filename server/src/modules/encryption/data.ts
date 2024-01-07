import { DecryptCommand, EncryptCommand } from '@aws-sdk/client-kms'
import kmsClient from '../../aws/keyManagementService/client'

export async function encrypt(dataToEncrypt: string, keyId: string) {
  const input = {
    KeyId: keyId,
    Plaintext: Buffer.from(dataToEncrypt),
  }

  const command = new EncryptCommand(input)
  const response = await kmsClient.send(command)

  // @ts-expect-error
  const buff = Buffer.from(response.CiphertextBlob)
  const encryptedBase64Data = buff.toString('base64')

  return encryptedBase64Data
}

export async function decrypt(dataToDecrypt: string, keyId: string) {
  const input = {
    KeyId: keyId,
    CiphertextBlob: Uint8Array.from(atob(dataToDecrypt), (v) =>
      v.charCodeAt(0)
    ),
  }

  const command = new DecryptCommand(input)

  const response = await kmsClient.send(command)

  const decryptedData = Buffer.from(response.Plaintext!).toString()

  return decryptedData
}

export async function verifyIntegrity(): Promise<boolean> {
  try {
    return false
  } catch (error) {
    console.error(error)
    throw error
  }
}
