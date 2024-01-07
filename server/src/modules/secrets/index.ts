import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'
import client from '../secrets/client'

async function getSecretValue(secretName: string): Promise<string | undefined> {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      })
    )
    const secret = response.SecretString

    return secret
  } catch (error) {
    throw error
  }
}

export default getSecretValue
