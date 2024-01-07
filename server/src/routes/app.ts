import { UserId } from './../../node_modules/aws-sdk/clients/alexaforbusiness.d'
import express from 'express'
import { addUserInfo, getHistoricalInfo } from '../services/data'
import { getUserById } from '../services/user'
import verifyToken from '../middleware/authMiddleware'
import getSecret from '../aws/secretsManager'

const router = express.Router()

router.use(verifyToken)

router.get('/', function (req, res, next) {
  res.status(200).json({
    data: {
      message: 'Hola',
    },
  })
})

router.post('/', async (req, res) => {
  const { userId, data } = req.body

  try {
    const user = await getUserById(userId)

    if (!user) {
      res.status(404).json({
        error: {
          message: 'User was not found.',
        },
      })
      return
    }

    await addUserInfo(userId, data)

    res.status(204).json({
      data: {
        message: 'Information updated succesfully',
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: {
        message: 'Internal Server Error',
      },
    })
  }
})

router.get('/historical', async (req, res) => {
  // @ts-ignore
  const userId = req.userId

  try {
    const user = await getUserById(userId)

    if (!user) {
      res.status(404).json({
        error: {
          message: 'Invalid credentials',
        },
      })
      return
    }

    const historical = await getHistoricalInfo(userId)

    res.status(200).json({ data: historical })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: { message: 'Internal Server Error' } })
  }
})

router.get('/verify', async (req, res) => {
  try {
    const secretKey = await getSecret(process.env.AWS_SESSION_SECRET_NAME!)

    if (!secretKey)
      throw new Error('Something went wrong getting secrets from AWS.')

    // @ts-ignore
    const user = await getUserById(req.userId)

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User Not Found',
        },
      })
    }

    return res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
