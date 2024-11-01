const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const path = require("path");
const cors = require('cors');

const db = require("./config/connection");
const {authMiddleware} = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    // context: authMiddleware,
    
    context: ({ req }) => {
      const modifiedReq = authMiddleware({ req });
      console.log('Context created:', modifiedReq.user);
      return { user: modifiedReq.user };
    },
    introspection: true,
    playground: true,
});

app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.json({ limit: "50mb" }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

if (process.env.NODE_ENV === "production") {
  // this code block, when enabled, occasionally shows a blank page on http://localhost:3001/graphql
  // to be run in production
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
}


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer();

