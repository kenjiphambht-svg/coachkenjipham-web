// Cloudflare portability proof only.
// This file mirrors the validated Cloudflare config contract used by
// @opennextjs/cloudflare 1.20.2 while keeping the proof dependency-free.
// The production application and business logic are unchanged.

const noOpAssetResolver = {
  name: "cloudflare-portability-proof-assets",
  async maybeGetAssetResult() {
    // Static assets bypass the Worker because wrangler.jsonc does not set
    // assets.run_worker_first. Keep middleware asset resolution inert.
    return undefined;
  },
};

export default {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
      cdnInvalidation: "dummy",
    },
    routePreloadingBehavior: "none",
  },
  edgeExternals: ["node:crypto"],
  cloudflare: {
    useWorkerdCondition: true,
  },
  dangerous: {
    enableCacheInterception: false,
  },
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
    assetResolver: () => noOpAssetResolver,
  },
};
