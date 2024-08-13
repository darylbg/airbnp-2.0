const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "5h";

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
      console.log('Token received:', token);
    }

    if (!token) {
      console.log('No token provided');
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('User verified:', data);
    } catch (error) {
      console.log('Invalid token:', error);
    }

    return req;
  },
  
  signToken: function ({ display_name, email, _id }) {
    const payload = { display_name, email, _id };
    console.log("login payload", payload);
    // req.user = payload;
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
