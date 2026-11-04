import "dotenv/config";

import { createServer } from "node:http";
import express from "express";
import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";

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
const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql"
});

const getUser = (authorization = "") => {
  const bearerToken = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  return bearerToken ? getUserFromToken(bearerToken, jwtSecret) : null;
};

const serverCleanup = useServer({
  schema,
  context: async ({ connectionParams }) => ({
    user: getUser(
      typeof connectionParams?.authorization === "string"
        ? connectionParams.authorization
        : ""
    )
  })
}, wsServer);

// 2. Create Apollo GraphQL server
const server = new ApolloServer({
  schema,
  // introspection: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        };
      }
    },
    // ApolloServerPluginLandingPageDisabled()
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
      return { user: getUser(req.get("authorization") || "") };
    }
  })
);

// 5. Start Express server
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});