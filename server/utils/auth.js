// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// // const secret = process.env.AUTH_SECRET;
// const secret = "laskjdlfasldjfkskldjfksald";
// const expiration = "2h";

// module.exports = {
//   authMiddleware: function ({ req }) {
//     // allows token to be set by req.body, req.query, or headers
//     let token = req.body.token || req.query.token || req.headers.authorization;

//     // ["Bearer", "<tokenvalue>"]
//     // if (req.headers.authorization) {
//     //   token = token.split(" ").pop().trim();
//     //   console.log("token here", token);
//     // }

//     // Check if token is present and not null
//     if (!token) {
//       return { req };
//     }

//     try {
//       // Extract the actual token from the Authorization header
//       token = token.split(" ")[1];
//       console.log("token here", token);
//       const { data } = jwt.verify(token, secret, { maxAge: expiration });
//       req.user = data;
//     } catch (error) {
//       console.log("Invalid token:", error.message);
//     }

//     return { req };
//   },

//   signToken: function ({ display_name, email, _id }) {
//     const payload = { display_name, email, _id };
//     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
//   },
// };

// old

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


