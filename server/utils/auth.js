const jwt = require('jsonwebtoken');
require('dotenv').config();

// const secret = process.env.AUTH_SECRET;
const secret = 'laskjdlfasldjfkskldjfksald';
const expiration = '2h';

module.exports = {
    authMiddleware: function ({ req }) {
        // allows token to be set by req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // Check if token is present and not null
        if (!token) {
            return { req };
        }

        try {
            // Extract the actual token from the Authorization header
            token = token.split(' ')[1];
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch (error) {
            console.log('Invalid token:', error.message);
        }

        return { req };
    },

    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    }
};

