import { KeyUsage } from './../../../node_modules/@aws-crypto/ie11-detection/build/MsSubtleCrypto.d'
import {
  CreateAliasCommand,
  CreateKeyCommand,
  DataKeySpec,
  GenerateDataKeyCommand,
  GenerateDataKeyCommandOutput,
  KeyUsageType,
} from '@aws-sdk/client-kms'
import client from './client'

export async function generateDataKey(
  keyId: string
): Promise<GenerateDataKeyCommandOutput> {
  try {
    const input = {
      KeyId: keyId,
      KeySpec: DataKeySpec.AES_256,
    }

    const command = new GenerateDataKeyCommand(input)
    const response = await client.send(command)

    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function createKMSKey(
  keyId: string
): Promise<GenerateDataKeyCommandOutput> {
  try {
    const input = {
      KeyUsage: KeyUsageType.ENCRYPT_DECRYPT,
    }
    const command = new CreateKeyCommand(input)
    const response = await client.send(command)

    const TargetKeyId = response.KeyMetadata?.Arn!

    // Create Alias for new KMS key
    const aliasInput = {
      AliasName: `alias/${keyId}`,
      TargetKeyId,
    }

    const aliasCommand = new CreateAliasCommand(aliasInput)
    await client.send(aliasCommand)

    const dataKey = await generateDataKey(TargetKeyId)

    return dataKey
  } catch (error) {
    console.error(error)
    throw error
  }
}
