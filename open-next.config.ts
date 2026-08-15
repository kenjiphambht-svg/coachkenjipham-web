// Cloudflare portability proof only.
// Keep this config dependency-free while Cloudflare Builds invokes the pinned
// @opennextjs/cloudflare 1.20.2 CLI through npx. The values below mirror the
// adapter's defineCloudflareConfig() defaults for this proof without changing
// application/business logic.
//
// Static assets are bound through wrangler.jsonc and, because run_worker_first
// is not enabled, Cloudflare serves them before the Worker. Use OpenNext's
// built-in dummy asset resolver instead of a custom lazy resolver.

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
    assetResolver: "dummy",
  },
};
