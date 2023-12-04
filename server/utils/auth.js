const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.AUTH_SECRET;
const expiration = '2h';

module.exports = {
    authMiddleware: function ({req}) {
        // allows token to be set by req.body, req.query or headers
        let token = req.body.token || req.query.token || req.authorization.headers;

        // req ["Bearer", <token value>]
        if (req.authorization.headers) {
            token = token.split('').pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, {maxAge: expiration});
            req.user = data;
        } catch {
            console.log('invalid token')
        }

        return req;
    },

    signToken: function ({username, email, _id}) {
        const payload = {username, email, _id};

        return jwt.sign({data: payload}, secret, {expiresIn: expiration})
    }
}
