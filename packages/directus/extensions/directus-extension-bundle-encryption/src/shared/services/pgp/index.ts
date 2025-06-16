import { ExtensionCtx } from "../../types"
import initKeys from "./keys"
import initMessages from "./messages"

export { initKeys, initMessages };

const initPGP = (ctx: ExtensionCtx) => {
  return {
    keys: initKeys(ctx),
    messages: initMessages(ctx)
  }
}

export default initPGP