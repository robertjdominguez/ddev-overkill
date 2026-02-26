import type { Request, Response } from "express";
import type { AppContext } from "../config/context";
import { getDb } from "../lib/db";

const SITE_NAME = "Rob Dominguez";
const DEFAULT_DESCRIPTION = "Software engineer, writer, and educator.";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildImageUrl(image: string | null, siteUrl: string): string | null {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  // DB values already include /storage/ prefix (e.g. /storage/assets/...)
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${siteUrl}${path}`;
}

function renderOgHtml(meta: {
  title: string;
  description: string;
  url: string;
  image: string | null;
  type: string;
}): string {
  const imageTag = meta.image
    ? `<meta property="og:image" content="${escapeHtml(meta.image)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.image)}" />`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <link rel="canonical" href="${escapeHtml(meta.url)}" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(meta.url)}" />

  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:type" content="${escapeHtml(meta.type)}" />
  <meta property="og:url" content="${escapeHtml(meta.url)}" />
  <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
  ${imageTag}

  <meta name="twitter:card" content="${meta.image ? "summary_large_image" : "summary"}" />
  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
</head>
<body></body>
</html>`;
}

export async function handleOg(req: Request, res: Response, context: AppContext) {
  const siteUrl = context.env.SITE_URL.replace(/\/$/, "");
  const path = (req.query.path as string) || "/";

  // Match /posts/:slug
  const postMatch = path.match(/^\/posts\/([^/?#]+)/);

  if (postMatch) {
    const slug = postMatch[1];
    const sql = getDb(context);

    const rows = await sql`
      SELECT title, hook, image, is_published
      FROM posts
      WHERE slug = ${slug} AND is_published = true
      LIMIT 1
    `;

    if (rows.length > 0) {
      const post = rows[0];
      const html = renderOgHtml({
        title: `${post.title} | ${SITE_NAME}`,
        description: post.hook || DEFAULT_DESCRIPTION,
        url: `${siteUrl}/posts/${slug}`,
        image: buildImageUrl(post.image, siteUrl),
        type: "article",
      });
      return res.type("html").send(html);
    }
  }

  // Default site-level OG tags
  const html = renderOgHtml({
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: `${siteUrl}${path}`,
    image: null,
    type: "website",
  });
  return res.type("html").send(html);
}
