import { v4 as uuidv4 } from 'uuid'
import { User, getUserByEmail } from './user'
import { dbClient } from '../modules/db/client'
import { hashPassword, passwordsMatch } from '../modules/encryption/password'

export async function createUser(
  email: string,
  password: string
): Promise<User | undefined> {
  const client = await dbClient.connect()
  const hashedPassword = await hashPassword(password)
  try {
    const text =
      'INSERT INTO users(id, email, password) VALUES($1, $2, $3) RETURNING id, email'
    const values = [uuidv4(), email, hashedPassword]

    const res = await client.query<User>(text, values)

    return res.rows[0]
  } catch (error) {
    console.error(error)
  } finally {
    client.release()
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<User | undefined> {
  try {
    const user = await getUserByEmail(email)

    if (!user || !passwordsMatch(password, user.password))
      throw new Error('Invalid credentials')

    return user
  } catch (error) {
    console.error(error)
  }
}
