import * as Yup from 'yup'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {}

export type User = {
  id: string
  email: string
}

const userSchema = Yup.object().shape({
  email: Yup.string().email('Write a valid email').required(),
  password: Yup.string()
    .min(10, 'Password needs to be at least 6 characters long')
    .required(),
})

export default function useAuth() {
  const URL = `${import.meta.env.VITE_APP_API_URL}/auth`

  async function registerUser(payload: RegisterPayload) {
    const response = await fetch(`${URL}/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const data: User = await response.json()

    return data
  }

  async function loginUser(payload: LoginPayload) {
    const response = await fetch(`${URL}/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    const data: { token: string } = await response.json()

    localStorage.setItem('token', data.token)

    return data
  }

  return {
    registerUser,
    loginUser,
    userSchema,
  }
}
