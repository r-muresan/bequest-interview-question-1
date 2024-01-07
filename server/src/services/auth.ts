import { v4 as uuidv4 } from 'uuid'
import { User, createUserEncryptionKey, getUserByEmail } from './user'
import { dbClient } from '../modules/db/client'
import { hashPassword, passwordsMatch } from '../modules/encryption/password'

export async function createUser(
  email: string,
  password: string
): Promise<User | undefined> {
  const client = await dbClient.connect()
  const hashedPassword = await hashPassword(password)
  try {
    const userId = uuidv4()
    const text =
      'INSERT INTO users(id, email, password) VALUES($1, $2, $3) RETURNING id, email'
    const values = [userId, email, hashedPassword]

    const userSecret = await createUserEncryptionKey(userId)

    if (!userSecret)
      throw new Error('Something went wrong creating user secret')

    const res = await client.query<User>(text, values)

    return res.rows[0]
  } catch (error) {
    console.error(error)
    throw error
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
