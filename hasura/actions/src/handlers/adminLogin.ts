import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { HasuraActionRequest } from "../types";
import type { AppContext } from "../config/context";
import type { Response } from "express";

interface AdminLoginInput {
  username: string;
  password: string;
}

export async function handleAdminLogin(
  request: HasuraActionRequest<AdminLoginInput>,
  res: Response,
  context: AppContext,
) {
  const { username, password } = request.input;

  if (username !== context.env.ADMIN_USERNAME) {
    return res.status(401).json({
      message: "Invalid credentials",
      extensions: { code: "INVALID_CREDENTIALS" },
    });
  }

  const valid = await bcrypt.compare(password, context.env.ADMIN_PASSWORD_HASH);
  if (!valid) {
    return res.status(401).json({
      message: "Invalid credentials",
      extensions: { code: "INVALID_CREDENTIALS" },
    });
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const token = jwt.sign(
    {
      sub: username,
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": "site_admin",
        "x-hasura-allowed-roles": ["site_admin", "public"],
        "x-hasura-user-id": username,
      },
    },
    context.env.HASURA_GRAPHQL_JWT_KEY,
    { algorithm: "HS256", expiresIn: "24h" },
  );

  return res.json({ token, expiresAt });
}
