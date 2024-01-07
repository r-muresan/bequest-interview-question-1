interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload extends LoginPayload {}

export default function useAuth() {
  const URL = `${import.meta.env.VITE_APP_API_URL}/auth`

  async function registerUser(payload: RegisterPayload) {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const data: { id: string; email: string } = await response.json()

    return data
  }

  async function loginUser(payload: LoginPayload) {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const data: { token: string } = await response.json()

    localStorage.setItem('token', data.token)

    return response.json()
  }

  return {
    registerUser,
    loginUser,
  }
}
