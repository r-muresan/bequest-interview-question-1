import { createKMSKey } from '../aws/keyManagementService'
import { dbClient } from '../modules/db/client'
import kmsClient from '../aws/keyManagementService/client'
import {
  DescribeKeyCommand,
  DescribeKeyCommandOutput,
} from '@aws-sdk/client-kms'

export interface User {
  id: string
  email: string
  password: string
}

export async function getUserById(userId: string): Promise<User | undefined> {
  const client = await dbClient.connect()

  try {
    const text = 'SELECT * FROM users WHERE id = $1'
    const values = [userId]

    const res = await client.query<User>(text, values)

    return res.rows[0]
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const client = await dbClient.connect()

  try {
    const text = 'SELECT * FROM users WHERE email = $1'
    const values = [email]

    const res = await client.query<User>(text, values)

    return res.rows[0]
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

export async function createUserEncryptionKey(userId: string) {
  try {
    const kmsKey = await createKMSKey(userId)

    if (!kmsKey) throw new Error('Something went wrong creating the KMS Key.')

    return kmsKey
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getUserEncryptionKey(
  userId: string
): Promise<DescribeKeyCommandOutput> {
  try {
    const input = {
      KeyId: `alias/${userId}`,
    }

    const command = new DescribeKeyCommand(input)
    const response = await kmsClient.send(command)

    return response
  } catch (error) {
    console.error(error)
    throw error
  }
}
