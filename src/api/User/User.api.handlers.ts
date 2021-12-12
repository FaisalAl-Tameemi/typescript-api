import { pick as pickFromObject } from 'lodash'
import { Request, Response } from 'express'
import ResponseUtil from '../../util/response.util'
import config from '../../config'
import { User } from '../../db'
import { encodeJwtToken, TokenTypes } from '../../util/token/token.util'

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    const newUser = User.build({
        name,
        email,
        password
    })

    return newUser
        .hashPassword()
        .then(() => newUser.save())
        .then(async (savedUser) => ({
            id: savedUser.id,
            email: savedUser.email,
            token: await encodeJwtToken(pickFromObject(savedUser, ['id', 'email']), TokenTypes.AUTH),
        }))
        .then(ResponseUtil.handleResponse(res))
        .catch(ResponseUtil.handleError(res))
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    return User
        .scope('withEmailAndPassword')
        .findOne({
            where: {
                email,
            }
        })
        .then(async (foundUser) => {
            // TODO: check if the user is not found
            
            const isPasswordValid = await foundUser.verifyPassword(password)

            if (!isPasswordValid) {
                throw new Error('Password is invalid')
            }

            return foundUser
        })
        .then(async (foundUser) => ({
            id: foundUser.id,
            email: foundUser.email,
            token: await encodeJwtToken(pickFromObject(foundUser, ['id', 'email']), TokenTypes.AUTH),
        }))
        .then(ResponseUtil.handleResponse(res, 200))
        .catch(ResponseUtil.handleError(res))
}
