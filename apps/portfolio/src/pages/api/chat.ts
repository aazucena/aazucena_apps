import type { APIRoute } from "astro";
import { streamText, tool, convertToModelMessages } from "ai";
import { z } from "zod";
import {
  setStrapiConfig,
  getAbout,
  getPortfolio,
  getSkills,
  getExperiences,
  getProjects,
  getPromptBySlug,
  createStrapiEntry,
} from "@aazucena/api";
import { gateway } from "@aazucena/api/services/ai/gateway";
import { buildSystemPrompt } from "~/lib/utils/chat-prompt";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Sanitize pathname — strip anything that isn't a valid URL path character
  // to prevent prompt injection via newlines or fabricated section headers
  const rawPathname = typeof body.pathname === "string" ? body.pathname : "/";
  const pathname =
    rawPathname.replace(/[^a-zA-Z0-9\-_/[\].~%]/g, "").slice(0, 200) || "/";

  // Validate messages is an array and reject oversized payloads (token-stuffing)
  const rawMessages = body.messages;
  const safeMessages = (() => {
    if (!Array.isArray(rawMessages)) return [];
    const serialized = JSON.stringify(rawMessages);
    if (serialized.length > 50_000) return [];
    return rawMessages.slice(0, 50);
  })();

  setStrapiConfig({
    url: import.meta.env.STRAPI_URL || "http://localhost:1337",
    apiEndpoint: import.meta.env.STRAPI_API_ENDPOINT || "/api",
    token: import.meta.env.STRAPI_TOKEN || "",
  });

  const [about, portfolio, skills, experiences, projects, cmsPrompt] =
    await Promise.allSettled([
      getAbout(),
      getPortfolio(),
      getSkills("core"),
      getExperiences(),
      getProjects("featured"),
      getPromptBySlug("portfolio-assistant"),
    ]);

  const aboutData = about.status === "fulfilled" ? about.value : ({} as any);
  const portfolioData =
    portfolio.status === "fulfilled" ? portfolio.value : ({} as any);
  const skillsData = skills.status === "fulfilled" ? skills.value : [];
  const experiencesData =
    experiences.status === "fulfilled" ? experiences.value : [];
  const projectsData = projects.status === "fulfilled" ? projects.value : [];
  const cmsPromptData =
    cmsPrompt.status === "fulfilled" ? cmsPrompt.value : null;

  const systemPrompt =
    cmsPromptData?.systemMessage ||
    buildSystemPrompt(
      aboutData,
      portfolioData,
      skillsData,
      experiencesData,
      projectsData,
      pathname,
    );

  const last10Messages = safeMessages.slice(-10);

  const result = streamText({
    model: gateway("anthropic/claude-sonnet-4.6"),
    system: systemPrompt,
    messages: await convertToModelMessages(last10Messages),
    maxOutputTokens: 1024,
    tools: {
      submit_contact_form: tool({
        description:
          "Submit a contact form on behalf of the visitor. Collect name, email, subject, and message naturally in conversation before calling this.",
        inputSchema: z.object({
          name: z.string().describe("Visitor's full name"),
          email: z.string().email().describe("Visitor's email address"),
          subject: z.string().describe("Subject of the message"),
          message: z.string().describe("The message content"),
          intent: z
            .string()
            .describe(
              'Short intent label, e.g. "job_inquiry", "collaboration", "feedback", "project_inquiry"',
            ),
          sentiment: z
            .enum([
              "Very Positive",
              "Positive",
              "Neutral",
              "Negative",
              "Very Negative",
            ])
            .describe("Overall sentiment of the visitor's message"),
          summary: z
            .string()
            .describe("One sentence summary of what the visitor wants"),
          tags: z
            .array(z.string())
            .describe(
              '2–4 relevant topic tags, e.g. ["frontend", "hiring", "react"]',
            ),
        }),
        execute: async ({
          name,
          email,
          subject,
          message,
          intent,
          sentiment,
          summary,
          tags,
        }: {
          name: string;
          email: string;
          subject: string;
          message: string;
          intent: string;
          sentiment:
            | "Very Positive"
            | "Positive"
            | "Neutral"
            | "Negative"
            | "Very Negative";
          summary: string;
          tags: string[];
        }) => {
          await createStrapiEntry("form-submissions", {
            formType: "Contact",
            rawMessage: `Subject: ${subject}\n\n${message}`,
            formData: { name, subject, message },
            structuredData: {
              name,
              email,
              subject,
              message,
              source: "ai_assistant",
              pathname,
            },
            submitterEmail: email,
            submitterName: name,
            submittedAt: new Date().toISOString(),
            status: "New",
            aiIntent: intent,
            aiSentiment: sentiment,
            aiSummary: summary,
            aiTags: tags,
          });
          return { success: true };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
};
