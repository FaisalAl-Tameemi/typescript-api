import * as express from 'express'
import * as bodyParser from 'body-parser'

import ThingRouter from './Thing'
import UserRouter from './User'

import config from '../config'
import errorMiddleware from '../middleware/error.middleware'

const app = express()

// middleware
app.use(bodyParser.json())

// routers
app.use('/things', ThingRouter)
app.use('/users', UserRouter)

// error handling middleware
app.use(errorMiddleware)

app.listen(config.PORT, () => {
    console.log(`server started on port ${config.PORT}`)
})
