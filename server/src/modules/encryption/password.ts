import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function passwordsMatch(
  plainTextPassword: string,
  actualPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, actualPassword)
}
