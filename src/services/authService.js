import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { users } from "../data/users.js";

export const login = (email, password) => {
  const user = users.find(
    (candidate) =>
      candidate.email === email && candidate.password === password
  );

  if (!user) {
    throw new GraphQLError("Invalid email or password", {
      extensions: { code: "UNAUTHENTICATED" }
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 10) {
    throw new Error("JWT_SECRET must be set to a secret of at least 10 characters");
  }

  const token = jwt.sign(
    { email: user.email },
    secret,
    { algorithm: "HS256", subject: user.id, expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
};

export const getUserFromToken = (token, secret) => {
  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    const user = users.find(
      (candidate) =>
        candidate.id === payload.sub && candidate.email === payload.email
    );

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return null;
    }

    throw error;
  }
};

export const requireAuthenticated = (context) => {
  if (!context.user) {
    throw new GraphQLError("You must be logged in to perform this operation", {
      extensions: { code: "UNAUTHENTICATED" }
    });
  }
};
