import type { RestClient, StaticTokenClient } from "@directus/sdk";
import { handleActivity, handleAssets, handleAuth, handleComments, handleFiles, handleItems, handleRequest, handleRoles, handleSystem, handleUsers, handleUtils } from "./handlers";
import type { AuthClient } from "./authentication";


export interface _RestClient<Schema> extends RestClient<Schema>, StaticTokenClient<Schema> {}

export default function adapter<Schema>(client: _RestClient<Schema>) {
  return {
    activity: handleActivity<Schema>(client),
    assets: handleAssets<Schema>(client),
    auth: handleAuth<Schema>(client as AuthClient<Schema>),
    comments: handleComments<Schema>(client),
    files: handleFiles<Schema>(client),
    items: handleItems<Schema>(client),
    request: handleRequest<Schema>(client),
    roles: handleRoles<Schema>(client),
    system: handleSystem<Schema>(client),
    users: handleUsers<Schema>(client),
    utils: handleUtils<Schema>(client),
    ...(client?.getToken ? {
      getToken: () => client.getToken(),
    }: {}),
    ...(client?.setToken ? {
      setToken: (access_token: string | null) => client.setToken(access_token),
    }: {}),
  };
}
export type RestAdapter = ReturnType<typeof adapter>;