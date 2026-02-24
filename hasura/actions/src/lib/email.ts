import { Resend } from "resend";
import mjml2html from "mjml";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { join } from "path";
import type { AppContext } from "../config/context";

const SITE_URL = "https://dominguezdev.com";
const FROM_EMAIL = "Rob <hello@dominguezdev.com>";

let resendClient: Resend | null = null;
let cachedWelcomeTemplate: string | null = null;

function getResend(context: AppContext): Resend {
  if (!resendClient) {
    resendClient = new Resend(context.env.RESEND_API_KEY);
  }
  return resendClient;
}

function generateUnsubscribeUrl(email: string, context: AppContext): string {
  const token = jwt.sign(
    { sub: email, purpose: "unsubscribe" },
    context.env.HASURA_GRAPHQL_JWT_KEY,
    { algorithm: "HS256" },
  );
  return `${SITE_URL}/unsubscribe?token=${token}`;
}

function getWelcomeTemplate(): string {
  if (!cachedWelcomeTemplate) {
    const mjmlPath = join(__dirname, "../templates/welcome-email.mjml");
    const mjmlContent = readFileSync(mjmlPath, "utf-8");
    const { html } = mjml2html(mjmlContent);
    cachedWelcomeTemplate = html.replaceAll("{{siteUrl}}", SITE_URL);
  }
  return cachedWelcomeTemplate!;
}

export async function sendWelcomeEmail(
  email: string,
  context: AppContext,
): Promise<void> {
  const resend = getResend(context);
  const unsubscribeUrl = generateUnsubscribeUrl(email, context);
  const html = getWelcomeTemplate().replaceAll(
    "{{unsubscribeUrl}}",
    unsubscribeUrl,
  );

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome aboard!",
    html,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}
