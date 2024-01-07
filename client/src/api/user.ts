import { User } from './auth'

export default function useUser() {
  const URL = `${import.meta.env.VITE_APP_API_URL}/app`

  async function verifyUser() {
    const token = localStorage.getItem('token')

    const response = await fetch(`${URL}/verify`, {
      headers: {
        Authorization: `Bearer: ${token}`,
      },
    })

    const data: User = await response.json()

    return data
  }

  return { verifyUser }
}
