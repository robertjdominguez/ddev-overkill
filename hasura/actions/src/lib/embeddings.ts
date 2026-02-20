import OpenAI from "openai";
import type { Request, Response } from "express";
import type { AppContext } from "../config/context";
import { getDb } from "./db";

const EMBEDDING_MODEL = "text-embedding-3-small";
const BATCH_SIZE = 20;

let openaiClient: OpenAI | null = null;

function getOpenAI(context: AppContext): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: context.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function generateEmbedding(
  text: string,
  context: AppContext,
): Promise<number[]> {
  const openai = getOpenAI(context);
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

export async function handleGenerateEmbeddings(
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

  const sql = getDb(context);
  const posts = await sql`
    SELECT id, title, hook, body
    FROM posts
    WHERE embedding IS NULL
  `;

  if (posts.length === 0) {
    return res.json({ message: "No posts need embeddings", updated: 0 });
  }

  let updated = 0;
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE);
    const openai = getOpenAI(context);

    const inputs = batch.map(
      (p) => `${p.title}\n${p.hook || ""}\n${p.body || ""}`.trim(),
    );

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: inputs,
    });

    for (let j = 0; j < batch.length; j++) {
      const embedding = response.data[j].embedding;
      const vectorStr = `[${embedding.join(",")}]`;
      await sql`
        UPDATE posts
        SET embedding = ${vectorStr}::vector
        WHERE id = ${batch[j].id}
      `;
      updated++;
    }
  }

  return res.json({ message: "Embeddings generated", updated });
}
