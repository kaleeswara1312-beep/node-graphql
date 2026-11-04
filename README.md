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
