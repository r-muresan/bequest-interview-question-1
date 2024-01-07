import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'
import client from './client'

export default async function getSecret(
  secretName: string
): Promise<string | undefined> {
  let response

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT',
      })
    )
    const secret = response.SecretString

    return secret
  } catch (error) {
    console.error(error)
    throw error
  }

  // Your code goes here
}
