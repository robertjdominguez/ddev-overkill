import postgres from "postgres";
import type { AppContext } from "../config/context";

let sql: ReturnType<typeof postgres> | null = null;

export function getDb(context: AppContext) {
  if (!sql) {
    sql = postgres(context.env.DATABASE_URL);
  }
  return sql;
}
