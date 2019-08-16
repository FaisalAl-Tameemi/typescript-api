import { Request, Response } from 'express'
import * as expressJWT from 'express-jwt'
import * as jwt from 'jsonwebtoken'
import * as boom from 'boom'

import { User } from '../db'
import config from '../config'
import logger from '../util/log.util'

const authMiddleware = expressJWT({
    secret: config.JWT_SECRET,
    credentialsRequired: true,
    // A method to extract the token from the request object
    getToken: function fromHeaderOrQuerystring (req: Request): string|null {
        if (req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }

        return null;
    }
})

/**
 * This method replicates what is being done using 'express-jwt' package
 * in the method above (authMiddleware) but using only the 'jsonwebtoken'
 * package. It is intended to replace the method above.
 *
 * It also does more than the method above since it will also attach
 * the full user object from the DB.
 */
export const requireAuth = (req: Request, res: Response, next: Function): void => {
    let token: string

    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
        token = req.query.token
    } else {
        throw boom.unauthorized('Missing or invalid token')
    }

    jwt.verify(token, config.JWT_SECRET, async (err, decodedToken) => {
        if (err || !decodedToken.id) {
            logger.error('@decodeJsonToken', err)
            throw boom.unauthorized('Missing or invalid token')
        }

        req['decodedToken'] = decodedToken

        try {
            req['user'] = await User.findByPk(decodedToken.id)
            return next()
        }
        catch (err) {
            return next(err)
        }
    })
}

export default authMiddleware
