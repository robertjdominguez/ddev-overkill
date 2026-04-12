import type { Producer } from "kafkajs";
import type { EnvConfig } from "./env";

export interface AppContext {
  env: EnvConfig;
  kafkaProducer: Producer;
}

export function createAppContext(env: EnvConfig, kafkaProducer: Producer): AppContext {
  return { env, kafkaProducer };
}
