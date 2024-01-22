const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Authorization header format: <tokenvalue>
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
      console.log(token)
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log("user verified:", data)
    } catch (error) {
      console.log("Invalid token:", error);
    }

    return req;
  },
  signToken: function ({ display_name, email, _id }) {
    const payload = { display_name, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};


