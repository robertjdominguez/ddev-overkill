import type { Request, Response } from "express";
import type { AppContext } from "../config/context";
import { getDb } from "../lib/db";
import { generateNewPostEmail } from "../lib/generate-email-content";
import { sendNewPostEmails } from "../lib/email";

export async function handleNotifySubscribers(
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

  const oldData = req.body.event?.data?.old;
  const newData = req.body.event?.data?.new;

  if (!newData) {
    return res.status(400).json({ message: "Invalid event payload" });
  }

  // Only notify on first publish: is_published flipped to true and first_published was previously null
  if (oldData?.first_published !== null || !newData.is_published) {
    console.log(
      `Skipped notify for post ${newData.id}: not a first publish`,
    );
    return res.json({ skipped: true, reason: "not a first publish" });
  }

  const sql = getDb(context);

  const subscribers = await sql`SELECT email FROM newsletter_subscribers`;
  if (subscribers.length === 0) {
    console.log("No subscribers to notify");
    return res.json({ skipped: true, reason: "no subscribers" });
  }

  const recentPosts = await sql`
    SELECT hook FROM posts
    WHERE is_published = true AND id != ${newData.id} AND hook IS NOT NULL
    ORDER BY first_published DESC NULLS LAST
    LIMIT 5
  `;
  const recentHooks = recentPosts.map((p) => p.hook as string);

  let subject: string;
  let body: string;

  try {
    const generated = await generateNewPostEmail(
      { title: newData.title, hook: newData.hook || "", slug: newData.slug, body: newData.body || "" },
      recentHooks,
      context,
    );
    subject = generated.subject;
    body = generated.body;
  } catch (err) {
    console.error("OpenAI email generation failed, using fallback:", err);
    subject = `New post: ${newData.title}`;
    body = newData.hook || newData.title;
  }

  const result = await sendNewPostEmails(
    subscribers as { email: string }[],
    { title: newData.title, slug: newData.slug },
    body,
    subject,
    context,
  );

  console.log(
    `Notified subscribers for post "${newData.title}": ${result.sent} sent, ${result.failed} failed`,
  );

  return res.json({ success: true, ...result });
}
