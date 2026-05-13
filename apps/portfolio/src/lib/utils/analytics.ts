/**
 * Server-side telemetry helper for Astro actions and AI tool executions.
 * Uses private env vars — the ingest secret never reaches the browser.
 */

interface FormSubmissionEvent {
  formType: "contact_direct" | "contact_chatbot";
  source: "direct_form" | "ai_assistant";
  intent?: string;
  sentiment?:
    | "Very Positive"
    | "Positive"
    | "Neutral"
    | "Negative"
    | "Very Negative";
  summary?: string;
  tags?: string[];
  url?: string;
}

export async function trackFormSubmission(
  event: FormSubmissionEvent,
): Promise<void> {
  const ingestUrl = import.meta.env.ANALYTICS_INGEST_URL;
  const secretKey = import.meta.env.ANALYTICS_INGEST_SECRET;

  if (!ingestUrl || !secretKey) return;

  const payload = {
    type: "form_submission",
    form_type: event.formType,
    source: event.source,
    intent: event.intent,
    sentiment: event.sentiment,
    summary: event.summary,
    tags: event.tags ? JSON.stringify(event.tags) : undefined,
    url: event.url,
  };

  fetch(`${ingestUrl}/api/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-secret-key": secretKey },
    body: JSON.stringify(payload),
  }).catch((err) =>
    console.error("[Analytics] Form submission tracking failed:", err.message),
  );
}
