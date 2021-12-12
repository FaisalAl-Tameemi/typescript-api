import * as express from 'express'
import * as bodyParser from 'body-parser'

import ThingRouter from './Thing'
import UserRouter from './User'

import config from '../config'
import errorMiddleware from '../middleware/error.middleware'
import logger from '../util/log.util'

const app = express()

app.set('PORT', config.PORT)

// middleware
app.use(bodyParser.json())

// health check route
app.get('/', (req: express.Request, res: express.Response) => res.json({ ok: true }))

// routers
// app.use('/things', ThingRouter) // as an example
app.use('/users', UserRouter)

// error handling middleware
app.use(errorMiddleware)

// otherwise listen using Express server only
app.listen(config.PORT, () => {
    console.log(`server started on port ${config.PORT}`)
})