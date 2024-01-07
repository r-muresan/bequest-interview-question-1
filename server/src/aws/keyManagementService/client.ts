import { KMSClient } from '@aws-sdk/client-kms'
import 'dotenv/config'

const client = new KMSClient({
  region: process.env.AWS_REGION,
})

export default client
