import { Resend } from "resend";
import mjml2html from "mjml";
import { readFileSync } from "fs";
import { join } from "path";
import type { AppContext } from "../config/context";

const SITE_URL = "https://dominguezdev.com";
const FROM_EMAIL = "Rob <hello@dominguezdev.com>";

let resendClient: Resend | null = null;
let cachedWelcomeHtml: string | null = null;

function getResend(context: AppContext): Resend {
  if (!resendClient) {
    resendClient = new Resend(context.env.RESEND_API_KEY);
  }
  return resendClient;
}

function getWelcomeHtml(): string {
  if (!cachedWelcomeHtml) {
    const mjmlPath = join(__dirname, "../templates/welcome-email.mjml");
    const mjmlContent = readFileSync(mjmlPath, "utf-8");
    const { html } = mjml2html(mjmlContent);
    cachedWelcomeHtml = html.replaceAll("{{siteUrl}}", SITE_URL);
  }
  return cachedWelcomeHtml;
}

export async function sendWelcomeEmail(
  email: string,
  context: AppContext,
): Promise<void> {
  const resend = getResend(context);
  const html = getWelcomeHtml();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome aboard!",
    html,
  });
}
