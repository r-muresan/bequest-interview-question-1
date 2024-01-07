import { Pool } from 'pg'
import 'dotenv/config'

export const dbClient = new Pool({
  host: process.env.APP_DB_HOST!,
  port: +process.env.APP_DB_PORT!,
  database: process.env.APP_DB_NAME!,
  user: process.env.APP_DB_USER!,
  password: process.env.APP_DB_PASSWORD!,
})

export const historyDbClient = new Pool({
  host: process.env.HISTORY_DB_HOST!,
  port: +process.env.HISTORY_DB_PORT!,
  database: process.env.HISTORY_DB_NAME!,
  user: process.env.HISTORY_DB_USER!,
  password: process.env.HISTORY_DB_PASSWORD!,
})
