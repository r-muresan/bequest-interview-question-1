import { dbClient, historyDbClient } from '../modules/db/client'
import { v4 as uuidv4 } from 'uuid'

interface DataRegistry {
  userId: string
  info: string
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
    let text
    let values

    const updateExistingRecords = await userHasInfo(userId)

    if (updateExistingRecords) {
      text = 'UPDATE users_data SET info = $1 WHERE user_id = $2'
      values = [info, userId]
    } else {
      text =
        'INSERT INTO users_data(user_id, info, created_on) VALUES ($1, $2, $3)'
      values = [userId, info, new Date().toISOString()]
    }

    Promise.all([
      await dbClient.query(text, values),
      await addHistoricalInfo(userId, info),
    ])
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

export async function addHistoricalInfo(userId: string, info: string) {
  const client = await historyDbClient.connect()
  try {
    const text =
      'INSERT INTO users_data_history(id, user_id, info, created_on) VALUES ($1, $2, $3, $4)'
    const values = [uuidv4(), userId, info, new Date().toISOString()]

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

    return res.rows
  } catch (error) {
    console.error(error)
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
      'SELECT info FROM users_data_history where user_id = $1 AND id = $2'

    const values = [userId, idPreviousRecord]

    const res = await historyClient.query<DataHistory>(text, values)

    const { info: previousRecord } = res.rows[0]

    const updateText = 'UPDATE users_data SET info = $1 WHERE user_id = $2'
    const updateValues = [previousRecord, userId]

    await appClient.query<DataRegistry>(updateText, updateValues)
  } catch (error) {
    console.error(error)
  } finally {
    historyClient.release()
    appClient.release()
  }
}
