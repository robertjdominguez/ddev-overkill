import type { HasuraActionRequest } from "../types";
import type { AppContext } from "../config/context";
import type { Response } from "express";
import { handleHello } from "./hello";
import { handleSearchPosts } from "./searchPosts";
import { handleAdminLogin } from "./adminLogin";
import { handleUnsubscribe } from "./unsubscribe";

type ActionHandler = (
  request: HasuraActionRequest,
  res: Response,
  context: AppContext,
) => void | Promise<void>;

const actionHandlers: Record<string, ActionHandler> = {
  hello: handleHello,
  searchPosts: handleSearchPosts,
  adminLogin: handleAdminLogin,
  unsubscribe: handleUnsubscribe,
};

export async function handleAction(
  actionName: string,
  request: HasuraActionRequest,
  res: Response,
  context: AppContext,
) {
  const handler = actionHandlers[actionName];
  if (!handler) {
    return res.status(400).json({
      message: `Unknown action: ${actionName}`,
      extensions: { code: "UNKNOWN_ACTION" },
    });
  }
  return await handler(request, res, context);
}
