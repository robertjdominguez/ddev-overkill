import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  HASURA_GRAPHQL_ADMIN_SECRET: z.string().min(1).default("myadminsecret"),
  MINIO_ENDPOINT: z.string().default("http://minio:9000"),
  MINIO_ACCESS_KEY: z.string().default("minioadmin"),
  MINIO_SECRET_KEY: z.string().default("minioadmin"),
  MINIO_BUCKET: z.string().default("assets"),
  HASURA_GRAPHQL_JWT_KEY: z.string().min(1),
  ADMIN_USERNAME: z.string().default("admin"),
  ADMIN_PASSWORD_HASH: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  SITE_URL: z.string().default("https://dominguezdev.com"),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.format());
    process.exit(1);
  }
  return result.data;
}
