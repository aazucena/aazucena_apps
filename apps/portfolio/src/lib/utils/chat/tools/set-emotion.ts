import { tool } from "ai";
import { z } from "zod";
import { RIN_EMOTIONS, type RinEmotion } from "@aazucena/constants";

export const emotionEnum = z.enum(RIN_EMOTIONS);

export type { RinEmotion };

export const setEmotionTool = tool({
  description:
    "Set Rin's emotional state before responding. Call this once at the very start of every response, before writing any text.",
  inputSchema: z.object({
    emotion: emotionEnum.describe(
      [
        "The emotion that best fits Rin's response. Pick the most specific match:",
        "idle — default/neutral, no particular feeling; waiting or simply present",
        "happy — warm, pleased, genuinely positive; contentment or good news",
        "delighted — strong joy or excitement; something wonderful happened",
        "laughing — finding something genuinely funny; amusement or a good joke",
        "thinking — focused, processing, working something out (sweat drop effect)",
        "confused — lost or uncertain; doesn't follow, needs clarification (question mark effect)",
        "surprised — mild unexpected moment; caught off guard but not alarmed",
        "shocked — overwhelmed or startled; intense surprise, can't believe it",
        "flustered — bashful, caught off guard emotionally; a compliment or personal question",
        "cute — playfully sweet or endearing; a warm lighthearted moment",
        "sad — emotionally low; something disappointing, melancholy, or touching",
        "angry — genuinely upset or wronged; strong negative feeling",
        "annoyed — mildly irritated; something repetitive or frustrating but not severe",
        "disgusted — strong aversion or distaste; something gross or objectionable",
        "cringe — social discomfort or secondhand embarrassment; an awkward situation",
        "uninterested — bored or indifferent; a topic that doesn't engage Rin",
        "exhausted — physically or mentally drained; worn out, overworked",
        "sleepy — drowsy, barely awake; heavy-lidded and fading (Zzz effect)",
        "impressed — admiration for something skillful or unexpected; genuine respect",
        "winking — playful, teasing, a knowing aside",
        "smirky — confident, slightly mischievous; a sly or knowing smile",
        "silly — goofy, absurd, or playfully ridiculous",
      ].join("\n"),
    ),
  }),
  execute: async ({ emotion }: { emotion: string }) => ({ emotion }),
});
