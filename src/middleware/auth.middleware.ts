import { Request } from 'express'
import * as expressJWT from 'express-jwt'

import config from '../config'

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

export default authMiddleware