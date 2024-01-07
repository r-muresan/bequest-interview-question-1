import { User } from './auth'
import * as Yup from 'yup'
export interface UpdateUserDataPayload {
  data: string
}

export interface RollbackInfoPayload {
  info_id?: string
}

interface DataHistory {
  id: string
  info: string
  created_on: string
}

export default function useUser() {
  const URL = `${import.meta.env.VITE_APP_API_URL}/app`
  const token = localStorage.getItem('token')

  const dataSchema = Yup.object().shape({
    data: Yup.string().required(),
  })

  async function verifyUser() {
    const response = await fetch(`${URL}/verify`, {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })

    const data: User = await response.json()

    return data
  }

  async function getUserHistoricalData() {
    const response = await fetch(`${URL}/historical`, {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })

    const data: { data: DataHistory[] } = await response.json()

    return data
  }

  async function updateUserData(payload: UpdateUserDataPayload) {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer: ${token}`,
      },
    })

    const data = await response.json()

    return data
  }

  async function getUserData(): Promise<
    { info: string } | { error: { message: string } } | undefined
  > {
    const response = await fetch(URL, {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })

    const info = await response.json()

    return info
  }

  async function rollbackFromPreviousValue(payload: RollbackInfoPayload) {
    if (!token) return

    const response = await fetch(`${URL}/rollback`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer: ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const info = await response.json()

    return info
  }

  return {
    verifyUser,
    getUserHistoricalData,
    updateUserData,
    getUserData,
    dataSchema,
    rollbackFromPreviousValue,
  }
}
