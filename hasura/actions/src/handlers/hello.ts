import type { HasuraActionRequest } from "../types";
import type { AppContext } from "../config/context";
import type { Response } from "express";

interface HelloInput {
  name: string;
}

export async function handleHello(
  request: HasuraActionRequest<HelloInput>,
  res: Response,
  _context: AppContext,
) {
  const name = request.input.name || "World";
  return res.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  });
}
