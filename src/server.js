import "dotenv/config";

import express from "express";
import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./resolvers/studentResolver.js";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { getUserFromToken } from "./services/authService.js";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 10) {
  throw new Error("JWT_SECRET must be set to a secret of at least 10 characters");
}

// 1. Create Express application
const app = express();

// 2. Create Apollo GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageDisabled()
  ]
});

// 3. Start Apollo Server
await server.start();

// 4. Configure GraphQL endpoint
app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authorization = req.get("authorization") || "";
      const bearerToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1];

      return {
        user: bearerToken
          ? getUserFromToken(bearerToken, jwtSecret)
          : null
      };
    }
  })
);

// 5. Start Express server
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});