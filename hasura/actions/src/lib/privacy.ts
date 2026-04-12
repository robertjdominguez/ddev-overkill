import { createHash } from "crypto";

const LOOPBACK = new Set(["::1", "127.0.0.1", "::ffff:127.0.0.1"]);

function isPrivateIp(ip: string): boolean {
  if (LOOPBACK.has(ip)) return true;
  // Docker bridge / private ranges
  if (ip.startsWith("172.") || ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
  return false;
}

export function hashIp(rawIp: string, salt: string): string | null {
  if (isPrivateIp(rawIp)) return null;
  return createHash("sha256").update(rawIp + salt).digest("hex");
}
