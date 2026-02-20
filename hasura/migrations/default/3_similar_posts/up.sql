CREATE OR REPLACE FUNCTION public.similar_posts(post_row posts, limit_count int DEFAULT 5)
RETURNS SETOF posts
LANGUAGE sql STABLE
AS $$
  SELECT p.*
  FROM posts p
  WHERE p.id != post_row.id
    AND p.embedding IS NOT NULL
    AND post_row.embedding IS NOT NULL
    AND 1 - (p.embedding <=> post_row.embedding) >= 0.3
  ORDER BY p.embedding <=> post_row.embedding
  LIMIT limit_count;
$$;
