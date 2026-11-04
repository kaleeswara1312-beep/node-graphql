# GraphQL API

## JWT authentication

Copy `.env.example` to `.env` and set `JWT_SECRET` to a private, random secret
of at least 32 characters. The server loads `.env` automatically with dotenv.
Keep `.env` private; it is excluded from Git.

Start the server:

```powershell
npm start
```

Use the `login` mutation with the demo account to receive a JWT:

```graphql
mutation {
  login(email: "demo@example.com", password: "password123") {
    token
    user { id name email }
  }
}
```

Pass the returned token on subsequent GraphQL requests in the
`Authorization: Bearer <token>` header. All student queries and mutations
require a valid token. Demo accounts are stored in memory and are for local
development only; replace this authentication data with persistent, securely
stored users before deploying.

## Try student subscriptions locally

The API publishes a `studentChanged` subscription when a student is created,
updated, or deleted. Start this Node server with `npm run dev`, then point the
React app's `.env` at the local GraphQL endpoint:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

Restart Vite after changing `.env`, sign in, and open **Live Updates**. Make a
student change from the Students screen (or another signed-in browser tab) to
see the event arrive.

The flow is:

1. React's `useSubscription` sends `studentChanged` through Apollo's
   `GraphQLWsLink` over WebSocket.
2. The WebSocket handshake sends the JWT in
   `connectionParams.authorization`; the server verifies it and protects the
   subscription resolver just like the student queries and mutations.
3. A successful student mutation publishes an event to the in-memory `PubSub`.
4. The async iterator in the subscription resolver delivers that event to each
   connected subscriber, and the React event list renders it.

The in-memory PubSub is for learning and works only within one running Node
process. For multiple server instances or durable event delivery, use a shared
PubSub backend such as Redis.
