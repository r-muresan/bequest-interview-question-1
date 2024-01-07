import { EncryptCommand } from '@aws-sdk/client-kms'
import client from '../../aws/kmsClient'

export async function cypherText(
  plainText: string
): Promise<string | undefined> {
  try {
    const input = {
      KeyId: process.env.AWS_KEY_ID,
      Plaintext: Buffer.from(plainText, 'utf-8'),
    }

    const command = new EncryptCommand(input)
    const response = await client.send(command)

    if (!response.CiphertextBlob) return undefined

    btoa(response.CiphertextBlob.toString())

    const encryptedString = new TextDecoder().decode(response.CiphertextBlob)

    return encryptedString
  } catch (error) {
    console.error('Error encrypting text:', error)
    throw error
  }
}
