import { pick as pickFromObject } from 'lodash'
import { Request, Response, Router } from 'express'
import { sign } from 'jsonwebtoken'

import ResponseUtil from '../../util/response.util'
import config from '../../config'
import { User } from '../../db'

const router = Router()

router.post('/register',  async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    const newUser = User.build({
        name,
        email,
        password
    })

    return newUser
        .hashPassword()
        .then(() => newUser.save())
        .then((savedUser) => ({
            id: savedUser.id,
            email: savedUser.email,
            token: sign(pickFromObject(savedUser, ['id', 'email']), config.JWT_SECRET),
        }))
        .then(ResponseUtil.handleResponse(res))
        .catch(ResponseUtil.handleError(res))
})

router.post('/login',  async (req: Request, res: Response) => {
    const { email, password } = req.body

    return User
        .scope('withEmailAndPassword')
        .findOne({
            where: {
                email,
            }
        })
        .then(ResponseUtil.handleNotFound(res, 403))
        .then(async (foundUser) => {
            const isPasswordValid = await foundUser.verifyPassword(password)

            if (!isPasswordValid) {
                throw new Error('Password is invalid')
            }

            return foundUser
        })
        .then((foundUser) => ({
            id: foundUser.id,
            email: foundUser.email,
            token: sign(pickFromObject(foundUser, ['id', 'email']), config.JWT_SECRET),
        }))
        .then(ResponseUtil.handleResponse(res))
        .catch(ResponseUtil.handleError(res))
})

export default router
