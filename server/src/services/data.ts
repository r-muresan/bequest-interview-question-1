import { KeyMetadata } from './../../node_modules/aws-sdk/clients/kms.d'
import { dbClient, historyDbClient } from '../modules/db/client'
import { v4 as uuidv4 } from 'uuid'
import { decrypt, encrypt } from '../modules/encryption/data'
import { getUserEncryptionKey } from './user'
import { calculateHash, verifyHash } from '../modules/encryption/index'

interface DataRegistry {
  userId: string
  info: string
  info_hash: string
  createdOn: string
}

interface DataHistory extends DataRegistry {
  id: string
}

async function userHasInfo(userId: string): Promise<boolean | undefined> {
  const client = await dbClient.connect()
  try {
    const text = 'SELECT user_id FROM users_data WHERE user_id = $1'
    const values = [userId]

    const res = await dbClient.query(text, values)

    if (res.rowCount === 0) return false

    return true
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

export async function addUserInfo(userId: string, info: string) {
  const client = await dbClient.connect()

  try {
    let text: string
    let values: [string, string, string] | [string, string, string, string]

    const { KeyMetadata } = await getUserEncryptionKey(userId)
    const userKmsKeyId = KeyMetadata?.KeyId!

    const encryptedInfo = await encrypt(info, userKmsKeyId)

    if (!encryptedInfo) return

    const hash = calculateHash(encryptedInfo)
    const updateExistingRecords = await userHasInfo(userId)

    if (updateExistingRecords) {
      text =
        'UPDATE users_data SET info = $1, info_hash = $2 WHERE user_id = $3'
      values = [encryptedInfo, hash, userId]
    } else {
      text =
        'INSERT INTO users_data(user_id, info, info_hash, created_on) VALUES ($1, $2, $3, $4)'
      values = [userId, encryptedInfo, hash, new Date().toISOString()]
    }

    Promise.all([
      await dbClient.query(text, values),
      await addHistoricalInfo(userId, encryptedInfo, hash),
    ])
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

export async function addHistoricalInfo(
  userId: string,
  info: string,
  infoHash: string
) {
  const client = await historyDbClient.connect()
  try {
    const text =
      'INSERT INTO users_data_history(id, user_id, info, info_hash, created_on) VALUES ($1, $2, $3, $4, $5)'
    const values = [uuidv4(), userId, info, infoHash, new Date().toISOString()]

    await client.query(text, values)
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

export async function getHistoricalInfo(userId: string) {
  const client = await historyDbClient.connect()

  try {
    const text =
      'SELECT id, info, created_on FROM users_data_history where user_id = $1 ORDER BY created_on DESC'
    const values = [userId]

    const res = await client.query<DataHistory>(text, values)

    const { KeyMetadata } = await getUserEncryptionKey(userId)
    const userKmsKeyId = KeyMetadata?.KeyId!

    const decryptedResults = Promise.all(
      res.rows.map(async (row) => {
        row.info = await decrypt(row.info, userKmsKeyId)

        return row
      })
    )

    return decryptedResults
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

export async function getUserData(userId: string): Promise<string | undefined> {
  const client = await dbClient.connect()

  try {
    const text = 'SELECT info, info_hash FROM users_data where user_id = $1'
    const values = [userId]

    const res = await client.query<DataRegistry>(text, values)

    if (res.rowCount === 0) return ''

    const { info: encryptedInfo, info_hash: infoHash } = res.rows[0]

    if (!verifyHash(encryptedInfo, infoHash))
      throw new Error('Data integrity is in danger.')

    const { KeyMetadata } = await getUserEncryptionKey(userId)
    const userKmsKeyId = KeyMetadata?.KeyId!
    const info = await decrypt(encryptedInfo, userKmsKeyId)

    return info
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    client.release()
  }
}

export async function rollbackFromPreviousValue(
  userId: string,
  idPreviousRecord: string
) {
  const historyClient = await historyDbClient.connect()
  const appClient = await dbClient.connect()

  try {
    const text =
      'SELECT info, info_hash FROM users_data_history where user_id = $1 AND id = $2'

    const values = [userId, idPreviousRecord]

    const res = await historyClient.query<DataHistory>(text, values)

    const { info: previousRecord, info_hash: previousRecordHash } = res.rows[0]

    const updateText =
      'UPDATE users_data SET info = $1, info_hash = $2 WHERE user_id = $3'
    const updateValues = [previousRecord, previousRecordHash, userId]

    await appClient.query<DataRegistry>(updateText, updateValues)
  } catch (error) {
    console.error(error)
  } finally {
    historyClient.release()
    appClient.release()
  }
}
