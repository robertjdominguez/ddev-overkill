import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { AppContext } from "../config/context";
import { uploadFile } from "../lib/storage";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function isAuthorized(req: Request, context: AppContext): boolean {
  // Admin secret auth (seed script, etc.)
  const adminSecret = req.headers["x-hasura-admin-secret"];
  if (adminSecret === context.env.HASURA_GRAPHQL_ADMIN_SECRET) {
    return true;
  }

  // JWT Bearer auth
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, context.env.HASURA_GRAPHQL_JWT_KEY, {
        algorithms: ["HS256"],
      }) as Record<string, any>;
      const claims = decoded["https://hasura.io/jwt/claims"];
      return claims?.["x-hasura-default-role"] === "site_admin";
    } catch {
      return false;
    }
  }

  return false;
}

export async function handleUploadAsset(
  req: Request,
  res: Response,
  context: AppContext,
) {
  if (!isAuthorized(req, context)) {
    return res.status(401).json({
      message: "Unauthorized",
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  const contentType = req.headers["content-type"] || "";
  const ext = ALLOWED_TYPES[contentType];
  if (!ext) {
    return res.status(400).json({
      message: `Unsupported content type: ${contentType}. Allowed: ${Object.keys(ALLOWED_TYPES).join(", ")}`,
      extensions: { code: "INVALID_CONTENT_TYPE" },
    });
  }

  const body = req.body as Buffer;
  if (!body || body.length === 0) {
    return res.status(400).json({
      message: "Empty body",
      extensions: { code: "EMPTY_BODY" },
    });
  }

  if (body.length > MAX_SIZE) {
    return res.status(400).json({
      message: `File too large (${(body.length / 1024 / 1024).toFixed(1)}MB). Max: 5MB`,
      extensions: { code: "FILE_TOO_LARGE" },
    });
  }

  const prefix = req.query.prefix || "uploads";
  const key = `${prefix}/${randomUUID()}.${ext}`;
  const bucket = context.env.MINIO_BUCKET;

  await uploadFile(key, body, contentType, context);

  return res.json({
    key,
    bucket,
    url: `/storage/${bucket}/${key}`,
  });
}
