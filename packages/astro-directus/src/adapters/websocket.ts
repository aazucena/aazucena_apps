import { messageCallback, type RestClient, type WebSocketClient, type WebSocketInterface } from "@directus/sdk";
import { handleUtils } from "./handlers";
export interface RealtimeClient<Schema> extends WebSocketClient<Schema>, RestClient<Schema> {
  messageCallback: (socket: WebSocketInterface, timeout?: number) => Promise<Record<string, any> | MessageEvent<string> | undefined>
  utils: Pick<ReturnType<typeof handleUtils>, 'sleep' | 'uuid' | 'formatFields' | 'queryToParams'>
}

export default function adapter<Schema>(client: RealtimeClient<Schema>) {
  const {
    uuid,
    formatFields,
    queryToParams,
    sleep,
  } = handleUtils(client);
  return {
    ...client,
    messageCallback: messageCallback,
    utils: {
      uuid,
      formatFields,
      queryToParams,
      sleep,
    },
  };
}
export type RealtimeAdapter = ReturnType<typeof adapter>;