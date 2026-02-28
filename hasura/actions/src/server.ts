import express from "express";
import cors from "cors";
import { validateEnv } from "./config/env";
import { createAppContext } from "./config/context";
import { handleAction } from "./handlers";
import { handleGenerateEmbeddings } from "./lib/embeddings";
import { handleGeneratePostEmbedding } from "./handlers/generatePostEmbedding";
import { handleUploadAsset } from "./handlers/uploadAsset";
import { handleSendWelcomeEmail } from "./handlers/sendWelcomeEmail";
import { handleNotifySubscribers } from "./handlers/notifySubscribers";
import { handleOg } from "./handlers/og";
import type { HasuraActionRequest } from "./types";
import type { Request, Response, NextFunction } from "express";

const env = validateEnv();
const appContext = createAppContext(env);

const app = express();
app.use(cors());
app.use(express.json());

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
}

app.get("/healthz", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get(
  "/og",
  asyncHandler(async (req: Request, res: Response) => {
    await handleOg(req, res, appContext);
  }),
);

app.post(
  "/actions",
  asyncHandler(async (req: Request, res: Response) => {
    const actionRequest: HasuraActionRequest = req.body;
    await handleAction(actionRequest.action.name, actionRequest, res, appContext);
  }),
);

app.post(
  "/generate-embeddings",
  asyncHandler(async (req: Request, res: Response) => {
    await handleGenerateEmbeddings(req, res, appContext);
  }),
);

app.post(
  "/generate-post-embedding",
  asyncHandler(async (req: Request, res: Response) => {
    await handleGeneratePostEmbedding(req, res, appContext);
  }),
);

app.post(
  "/send-welcome-email",
  asyncHandler(async (req: Request, res: Response) => {
    await handleSendWelcomeEmail(req, res, appContext);
  }),
);

app.post(
  "/notify-subscribers",
  asyncHandler(async (req: Request, res: Response) => {
    await handleNotifySubscribers(req, res, appContext);
  }),
);

app.post(
  "/upload-asset",
  express.raw({ type: ["image/*"], limit: "5mb" }),
  asyncHandler(async (req: Request, res: Response) => {
    await handleUploadAsset(req, res, appContext);
  }),
);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: err.message || "Internal server error",
    extensions: { code: "INTERNAL_ERROR" },
  });
});

app.listen(env.PORT, () => {
  console.log(`Actions server running on port ${env.PORT}`);
});
