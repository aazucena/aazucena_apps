import { tool } from "ai";
import { z } from "zod";

export const emotionEnum = z.enum([
  "idle",
  "happy",
  "thinking",
  "surprised",
  "shocked",
  "flustered",
  "sad",
  "angry",
  "disgusted",
  "laughing",
  "delighted",
  "uninterested",
  "cute",
  "annoyed",
  "winking",
  "silly",
  "smirky",
  "cringe",
  "impressed",
  "exhausted",
  "confused",
  "sleepy",
]);

export type RinEmotion = z.infer<typeof emotionEnum>;

export const setEmotionTool = tool({
  description:
    "Set Rin's emotional state before responding. Call this once at the very start of every response, before writing any text.",
  inputSchema: z.object({
    emotion: emotionEnum.describe(
      "The emotion that best fits Rin's response to this message",
    ),
  }),
  execute: async ({ emotion }: { emotion: string }) => ({ emotion }),
});
