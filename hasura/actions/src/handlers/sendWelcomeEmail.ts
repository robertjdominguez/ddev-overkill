import type { Request, Response } from "express";
import type { AppContext } from "../config/context";
import { sendWelcomeEmail } from "../lib/email";

export async function handleSendWelcomeEmail(
  req: Request,
  res: Response,
  context: AppContext,
) {
  const adminSecret = req.headers["x-hasura-admin-secret"];
  if (adminSecret !== context.env.HASURA_GRAPHQL_ADMIN_SECRET) {
    return res.status(401).json({
      message: "Unauthorized",
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  const subscriber = req.body.event?.data?.new;
  if (!subscriber) {
    return res.status(400).json({ message: "Invalid event payload" });
  }

  await sendWelcomeEmail(subscriber.email, context);

  console.log(`Sent welcome email to ${subscriber.email}`);
  return res.json({ success: true, email: subscriber.email });
}
