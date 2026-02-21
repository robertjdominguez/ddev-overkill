import type { Request, Response } from "express";
import type { AppContext } from "../config/context";
import { generateEmbedding } from "../lib/embeddings";
import { getDb } from "../lib/db";

export async function handleGeneratePostEmbedding(
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

  const post = req.body.event?.data?.new;
  if (!post) {
    return res.status(400).json({ message: "Invalid event payload" });
  }

  if (!post.is_published) {
    return res.json({ skipped: true, reason: "post is not published" });
  }

  const text = `${post.title}\n${post.hook || ""}\n${post.body || ""}`.trim();
  const embedding = await generateEmbedding(text, context);
  const vectorStr = `[${embedding.join(",")}]`;

  const sql = getDb(context);
  await sql`UPDATE posts SET embedding = ${vectorStr}::vector WHERE id = ${post.id}`;

  console.log(`Generated embedding for post ${post.id} (${post.slug})`);
  return res.json({ success: true, postId: post.id });
}
