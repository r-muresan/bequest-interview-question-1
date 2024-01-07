import { message } from './../../node_modules/aws-sdk/clients/customerprofiles.d'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import getSecret from '../aws/secretsManager'

export default async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.header('Authorization')

  if (!authorizationHeader) return

  const token = authorizationHeader.split(' ')[1]

  console.log({ token })
  const secretKey = await getSecret(process.env.AWS_SESSION_SECRET_NAME!)

  if (!secretKey)
    return res
      .status(500)
      .json({ error: { message: 'Internal Server Error.' } })

  if (!token)
    return res.status(401).json({ error: { message: 'Access Denied' } })

  try {
    const decoded = jwt.verify(token, secretKey)
    // @ts-ignore
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Invalid token',
      },
    })
  }
}
