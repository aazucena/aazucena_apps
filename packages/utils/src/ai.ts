import { DEFAULT_CHAT_MODEL, isChatModel, type ChatModelId } from '@aazucena/constants';

export type ResolvedChatModel = { ok: true; id: ChatModelId } | { ok: false };

/**
 * Validates a model id sent by a client against the Claude catalogue.
 * Missing → the default chat model; a catalogue id → accepted; anything else → rejected.
 */
export function resolveChatModel(input: unknown): ResolvedChatModel {
  if (input === undefined || input === null) return { ok: true, id: DEFAULT_CHAT_MODEL };
  return isChatModel(input) ? { ok: true, id: input } : { ok: false };
}
