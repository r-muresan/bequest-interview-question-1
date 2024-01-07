import { dbClient } from '../modules/db/client'

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
