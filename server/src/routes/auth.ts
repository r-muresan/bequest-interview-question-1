import express from 'express'
import { getUserByEmail } from '../services/user'
import { createUser, loginUser } from '../services/auth'
import getSecret from '../aws/secretsManager'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      res
        .status(400)
        .json({ error: { message: 'User with this email already exists' } })
      return
    }

    const user = await createUser(email, password)
    res.status(201).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: { message: 'Internal Server Error' } })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await loginUser(email, password)
    const secretKey = await getSecret(process.env.AWS_SESSION_SECRET_NAME!)

    if (!secretKey)
      throw new Error('Something went wrong getting secrets from AWS.')

    if (!user) {
      res.status(404).json({
        error: {
          message: 'Invalid credentials',
        },
      })
      return
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      secretKey,
      {
        expiresIn: '1h',
      }
    )

    res.status(200).json({
      token,
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
