import moduleAlias from "module-alias"
moduleAlias.addAlias("@", __dirname)

import express, { Express, Request, Response, Application } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from "cors"
import { errorHandler } from '@/middlewares/error-handler.middleware'
// import { connectToDatabase } from '@/database/index'.
import { router } from '@/routes'
import 'express-async-errors'
//For env File
dotenv.config()

const app: Application = express()
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

const port = process.env.PORT || 8000
app.use(cors<Request>())
// ; (async () => {
//   await connectToDatabase()
//   console.log('Connected to the database successfully!')
// })()

app.use(router)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`)
})
