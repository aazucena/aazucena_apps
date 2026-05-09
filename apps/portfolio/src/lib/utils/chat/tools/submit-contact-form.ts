import { tool } from "ai";
import { z } from "zod";
import { createStrapiEntry } from "@aazucena/api";

export function createSubmitContactFormTool(pathname: string) {
  return tool({
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
  });
}
