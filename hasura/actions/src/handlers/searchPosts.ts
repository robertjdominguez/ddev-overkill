import type { HasuraActionRequest } from "../types";
import type { AppContext } from "../config/context";
import type { Response } from "express";
import { generateEmbedding } from "../lib/embeddings";
import { getDb } from "../lib/db";

interface SearchPostsInput {
  query: string;
  limit?: number;
}

export async function handleSearchPosts(
  request: HasuraActionRequest<SearchPostsInput>,
  res: Response,
  context: AppContext,
) {
  const { query, limit = 5 } = request.input;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      message: "Query must not be empty",
      extensions: { code: "INVALID_INPUT" },
    });
  }

  const embedding = await generateEmbedding(query, context);
  const vectorStr = `[${embedding.join(",")}]`;
  const sql = getDb(context);

  const results = await sql`
    SELECT
      id,
      slug,
      title,
      hook,
      1 - (embedding <=> ${vectorStr}::vector) AS similarity,
      created_at
    FROM posts
    WHERE embedding IS NOT NULL
      AND 1 - (embedding <=> ${vectorStr}::vector) >= 0.15
    ORDER BY embedding <=> ${vectorStr}::vector
    LIMIT ${limit}
  `;

  return res.json(
    results.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      hook: r.hook,
      similarity: parseFloat(r.similarity),
      createdAt: r.created_at,
    })),
  );
}
