import { randomUUID } from "crypto";
import type { Request, Response } from "express";
import type { AppContext } from "../config/context";
import { topicForEventType } from "../lib/kafka";
import { lookupGeo } from "../lib/geo";
import { hashIp } from "../lib/privacy";

const VALID_EVENT_TYPES = new Set([
  "post.viewed",
  "search.performed",
  "similarity.clicked",
  "post.created",
]);

export async function handleTrack(
  req: Request,
  res: Response,
  ctx: AppContext,
): Promise<void> {
  const { event_type, session_id, payload } = req.body;

  if (!event_type || !VALID_EVENT_TYPES.has(event_type)) {
    res.status(400).json({ error: "Unknown or missing event_type" });
    return;
  }

  if (!session_id) {
    res.status(400).json({ error: "Missing session_id" });
    return;
  }

  if (!payload || typeof payload !== "object") {
    res.status(400).json({ error: "Missing or invalid payload" });
    return;
  }

  const topic = topicForEventType(event_type);
  if (!topic) {
    res.status(400).json({ error: "Unknown event_type" });
    return;
  }

  const rawIp = req.ip || "127.0.0.1";
  const geo = lookupGeo(rawIp);
  const ipHash = hashIp(rawIp, ctx.env.IP_SALT);

  const event = {
    event_id: randomUUID(),
    event_type,
    session_id,
    ip_hash: ipHash,
    country: geo.country,
    region: geo.region,
    city: geo.city,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timestamp: new Date().toISOString(),
    app_version: ctx.env.APP_VERSION,
    ...payload,
  };

  try {
    await ctx.kafkaProducer.send({
      topic,
      messages: [{ key: event.event_id, value: JSON.stringify(event) }],
    });
  } catch (err) {
    console.error("Kafka produce failed:", err);
    res.status(500).json({ error: "Event publish failed" });
    return;
  }

  res.status(202).json({ status: "accepted", event_id: event.event_id });
}
