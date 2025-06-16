import type { AuthenticationClient, RestClient, RestCommand } from "@directus/sdk";
import { isDirectusError } from "@directus/sdk";
export const createRestHandler = <Output extends object, Schema>(client: RestClient<Schema>) => {
  return async (command: RestCommand<Output, Schema>) => {
    try {
      const result = await client.request(command);
      return result;
    } catch (error) {
      if (isDirectusError(error)) {
        throw error;
      } else {
        throw new Error(error);
      }
    }
  }
};
export const runClientHandler = async<Output extends any>(callback: () => Promise<Output>) => {
    try {
    const result = await callback();
    return result;
  } catch (error) {
    if (isDirectusError(error)) {
      throw error;
    } else {
      throw new Error(error);
    }
  }
}