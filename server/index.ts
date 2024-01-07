import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRoutes from './src/routes/auth'
import appRoutes from './src/routes/app'

const PORT = process.env.PORT || 8080

const app = express()

app.use(
  cors({
    origin: '*',
  })
)

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/app', appRoutes)

app.listen(PORT, async () => {
  console.log('Server running on port ' + PORT)
})
