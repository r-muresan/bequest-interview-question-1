import {
  CreateSecretCommand,
  CreateSecretCommandOutput,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'
import client from './client'

export async function getSecret(
  secretName: string
): Promise<string | undefined> {
  try {
    const input = {
      SecretId: secretName,
      VersionStage: 'AWSCURRENT',
    }

    const command = new GetSecretValueCommand(input)

    const response = await client.send(command)

    const secret = response.SecretString

    return secret
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function createSecret(
  secretId: string,
  secretValue: string,
  kmsKeyId: string
): Promise<CreateSecretCommandOutput> {
  try {
    const input = {
      Name: secretId,
      SecretString: secretValue,
      KmsKeyId: kmsKeyId,
    }

    const command = new CreateSecretCommand(input)
    const response = await client.send(command)

    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}
