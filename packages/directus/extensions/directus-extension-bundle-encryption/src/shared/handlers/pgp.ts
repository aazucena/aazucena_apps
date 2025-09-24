import { EndpointExtensionContext } from "@directus/extensions";
import { createExtensions } from "../factory";
import { PGPEncryptionService } from "../services";

class PGPEncryptionHandler {
  private service: PGPEncryptionService;
  constructor(ctx: EndpointExtensionContext) {
    const { PGP } = createExtensions(ctx);
    this.service = PGP;
  };
  useService = () => {
    return this.service;
  };
};

export default PGPEncryptionHandler;