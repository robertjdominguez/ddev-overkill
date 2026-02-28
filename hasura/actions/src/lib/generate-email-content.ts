import OpenAI from "openai";
import type { AppContext } from "../config/context";

interface Post {
  title: string;
  hook: string;
  slug: string;
  body: string;
}

interface EmailContent {
  subject: string;
  body: string;
}

export async function generateNewPostEmail(
  post: Post,
  recentHooks: string[],
  context: AppContext,
): Promise<EmailContent> {
  const openai = new OpenAI({ apiKey: context.env.OPENAI_API_KEY });

  const fewShotExamples = recentHooks
    .map((hook, i) => `Example ${i + 1}: ${hook}`)
    .join("\n");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are Rob Dominguez, a software engineer who writes about web dev, AI, and building things. Your writing voice is: conversational, uses pop culture references, self-deprecating humor, punchy short sentences, rhetorical questions, and directly addresses the reader ("you"). You're writing an email to newsletter subscribers about a new blog post. Return JSON with "subject" and "body" fields. The subject should be under 60 characters and compelling. The body should be 2-3 short paragraphs (60-100 words total) that tease the post content and make the reader want to click through. Do NOT include any links or URLs in the body — there's a button for that.`,
      },
      {
        role: "user",
        content: `Here are examples of my recent writing style for reference:\n${fewShotExamples}\n\nNew post title: "${post.title}"\nNew post hook: "${post.hook}"\n\nPost content:\n${post.body.slice(0, 1500)}\n\nWrite the email notification.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  const parsed = JSON.parse(content) as EmailContent;

  if (!parsed.subject || !parsed.body) {
    throw new Error("Missing subject or body in OpenAI response");
  }

  return parsed;
}
