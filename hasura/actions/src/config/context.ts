import type { EnvConfig } from "./env";

export interface AppContext {
  env: EnvConfig;
}

export function createAppContext(env: EnvConfig): AppContext {
  return { env };
}
