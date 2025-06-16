import { ExtensionCtx } from "./types";
import { initPGP } from "./services";

export const createExtensions = (ctx: ExtensionCtx) => {
  const PGP = initPGP(ctx);
  return { ...ctx, PGP }
}