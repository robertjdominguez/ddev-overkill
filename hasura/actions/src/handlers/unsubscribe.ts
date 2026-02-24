import jwt from "jsonwebtoken";
import type { HasuraActionRequest } from "../types";
import type { AppContext } from "../config/context";
import type { Response } from "express";
import { getDb } from "../lib/db";

interface UnsubscribeInput {
  token: string;
}

interface UnsubscribePayload {
  sub: string;
  purpose: string;
}

export async function handleUnsubscribe(
  request: HasuraActionRequest<UnsubscribeInput>,
  res: Response,
  context: AppContext,
) {
  const { token } = request.input;

  let payload: UnsubscribePayload;
  try {
    payload = jwt.verify(token, context.env.HASURA_GRAPHQL_JWT_KEY, {
      algorithms: ["HS256"],
    }) as UnsubscribePayload;
  } catch {
    return res.status(400).json({
      message: "Invalid or expired token",
      extensions: { code: "INVALID_TOKEN" },
    });
  }

  if (payload.purpose !== "unsubscribe") {
    return res.status(400).json({
      message: "Invalid token purpose",
      extensions: { code: "INVALID_TOKEN" },
    });
  }

  const sql = getDb(context);
  await sql`DELETE FROM newsletter_subscribers WHERE email = ${payload.sub}`;

  return res.json({ success: true });
}
