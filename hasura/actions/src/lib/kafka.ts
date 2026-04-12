import { Kafka, type Producer } from "kafkajs";

const VALID_TOPICS = [
  "site.post.viewed",
  "site.search.performed",
  "site.similarity.clicked",
  "site.post.created",
] as const;

export type EventTopic = (typeof VALID_TOPICS)[number];

const EVENT_TYPE_TO_TOPIC: Record<string, EventTopic> = {
  "post.viewed": "site.post.viewed",
  "search.performed": "site.search.performed",
  "similarity.clicked": "site.similarity.clicked",
  "post.created": "site.post.created",
};

export function topicForEventType(eventType: string): EventTopic | null {
  return EVENT_TYPE_TO_TOPIC[eventType] ?? null;
}

export async function connectProducer(broker: string): Promise<Producer> {
  const kafka = new Kafka({
    clientId: "actions-service",
    brokers: [broker],
  });

  const producer = kafka.producer();
  await producer.connect();
  console.log("Kafka producer connected");
  return producer;
}
